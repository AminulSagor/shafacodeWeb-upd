import { requestUpload } from '@/actions/uploads';
import type { UploadKind } from '@/lib/storage';

export type UploadedFile = { kind: UploadKind; name: string; size: number; type: string } & (
  | { path: string; url?: never }
  | { url: string; path?: never }
);

/** Uploads a file in the browser: signed URL when available, legacy public bucket otherwise. */
export async function uploadFile(kind: UploadKind, file: File, onProgress?: (pct: number) => void): Promise<UploadedFile> {
  const ticket = await requestUpload({ kind, type: file.type, size: file.size });
  if (!ticket.ok) throw new Error(ticket.error);
  const meta = { kind, name: file.name, size: file.size, type: file.type };

  if (ticket.mode === 'signed') {
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', ticket.signedUrl);
      xhr.setRequestHeader('x-upsert', 'false');
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error('Upload failed. Please try again.')));
      xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
      const body = new FormData();
      body.append('cacheControl', '3600');
      body.append('', file);
      xhr.send(body);
    });
    return { ...meta, path: ticket.path };
  }

  // Legacy: the previous public bucket, until signed uploads are configured.
  const { supabase } = await import('@/lib/supabase-client');
  const name = `${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`;
  onProgress?.(10);
  const { error } = await supabase.storage.from('shafacode').upload(name, file, { contentType: file.type });
  if (error) throw new Error('Upload failed. Please try again.');
  onProgress?.(100);
  const { data } = supabase.storage.from('shafacode').getPublicUrl(name);
  return { ...meta, url: data.publicUrl };
}
