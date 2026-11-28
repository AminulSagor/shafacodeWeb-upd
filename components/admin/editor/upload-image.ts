'use client';

import { registerMedia, requestMediaUpload } from '@/actions/admin/media';
import type { MediaItem } from '@/lib/admin/media';
import { fileMime } from '@/lib/upload-client';

/** Reads the image size, uploads through a signed URL, then registers it in the library. */
export async function uploadImage(file: File, alt: string, onProgress?: (p: number) => void): Promise<MediaItem> {
  const type = fileMime(file);
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error('That file is not an image this browser can read.');
  const { width, height } = bitmap;
  bitmap.close();
  const ticket = await requestMediaUpload({ type, size: file.size });
  if (!ticket.ok || !ticket.data) throw new Error(ticket.ok ? 'Upload failed.' : ticket.error);
  const { path, signedUrl } = ticket.data;
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload failed.')));
    xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
    xhr.onabort = () => reject(new Error('Upload cancelled.'));
    const body = new FormData();
    body.append('cacheControl', '31536000');
    body.append('', file);
    xhr.send(body);
  });
  const res = await registerMedia({ path, alt, width, height, size: file.size, type });
  if (!res.ok || !res.data) throw new Error(res.ok ? 'Upload failed.' : res.error);
  return res.data;
}
