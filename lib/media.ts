/** Public URL of a file in the Supabase `media` bucket, from its storage path. */
export function publicMediaUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path; // legacy documents store full URLs
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ocectkchrhtbvthhwbtc.supabase.co';
  return `${base}/storage/v1/object/public/media/${path.replace(/^\/+/, '')}`;
}
