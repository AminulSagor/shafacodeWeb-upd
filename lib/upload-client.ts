import { requestUpload } from '@/actions/uploads';
import type { UploadKind } from '@/lib/storage';

export type UploadedFile = { kind: UploadKind; name: string; size: number; type: string } & (
  | { path: string; url?: never }
  | { url: string; path?: never }
);

const BY_EXT: Record<string, string> = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };

/**
 * The file's MIME type, from the extension when the browser reports none or a
 * vendor alias (Windows and some mobile browsers). The server still checks the
 * magic bytes.
 */
export function fileMime(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const known = Object.values(BY_EXT);
  if (known.includes(file.type)) return file.type;
  if (file.type === 'application/x-pdf') return 'application/pdf';
  return BY_EXT[ext] ?? file.type;
}

/** Uploads a file in the browser: signed URL when available, legacy public bucket otherwise. */
export async function uploadFile(kind: UploadKind, file: File, onProgress?: (pct: number) => void): Promise<UploadedFile> {
  const type = fileMime(file);
  const ticket = await requestUpload({ kind, type, size: file.size });
  if (!ticket.ok) throw new Error(ticket.error);
  const meta = { kind, name: file.name, size: file.size, type };

  if (ticket.mode === 'signed') {
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', ticket.signedUrl);
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload failed. Please try again.')));
      xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
      xhr.onabort = () => reject(new Error('Upload cancelled.'));
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
  const { error } = await supabase.storage.from('shafacode').upload(name, file, { contentType: type });
  if (error) throw new Error('Upload failed. Please try again.');
  onProgress?.(100);
  const { data } = supabase.storage.from('shafacode').getPublicUrl(name);
  return { ...meta, url: data.publicUrl };
}
