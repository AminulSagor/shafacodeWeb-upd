/** Image URL for a stored media path: local /images files as they are, storage paths in the media bucket. */
export function mediaSrc(path: string) {
  if (path.startsWith('//')) return '';
  return path.startsWith('/') ? path : publicMediaUrl(path);
}

/** Public URL of a file in the Supabase `media` bucket, from its storage path. */
export function publicMediaUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path; // legacy documents store full URLs
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://ocectkchrhtbvthhwbtc.supabase.co').replace(/\/+$/, '');
  return `${base}/storage/v1/object/public/media/${path.replace(/^\/+/, '')}`;
}
