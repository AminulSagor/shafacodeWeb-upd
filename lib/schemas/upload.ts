import { z } from 'zod';

/** Public URL prefix of the legacy `shafacode` bucket (used until signed uploads are configured). */
export function legacyPublicPrefix() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  return base ? `${base}/storage/v1/object/public/shafacode/` : null;
}

export function isLegacyPublicUrl(url: string) {
  const prefix = legacyPublicPrefix();
  return !!prefix && url.startsWith('https://') && url.startsWith(prefix) && !url.includes('..');
}

const meta = { name: z.string().max(200), size: z.number().int().nonnegative(), type: z.string().max(100) };

/**
 * An uploaded file: a storage path from a signed upload (verified on the
 * server), or a URL in the legacy public bucket, never any other URL.
 */
export const uploadedFile = z.union([
  z.object({ path: z.string().min(1).max(200), ...meta }),
  z.object({ url: z.string().max(600).refine(isLegacyPublicUrl, 'Upload the file again.'), ...meta }),
]);

export type UploadedFileInput = z.infer<typeof uploadedFile>;

/** Email with surrounding whitespace removed (autofill and paste often add it). */
export const emailField = (message = 'Enter a valid email address.') =>
  z.string().trim().max(200).pipe(z.email(message));
