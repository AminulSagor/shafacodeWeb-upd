'use server';

import { z } from 'zod';

import { clientIp, rateLimit } from '@/lib/rate-limit';
import { createSignedUpload, legacyUploadsAllowed, uploadRules, type UploadKind } from '@/lib/storage';

const input = z.object({
  kind: z.enum(['resume', 'attachment', 'affiliate']),
  type: z.string().max(100),
  size: z.number().int().positive(),
});

export type UploadTicket =
  | { ok: true; mode: 'signed'; bucket: string; path: string; signedUrl: string }
  | { ok: true; mode: 'legacy' }
  | { ok: false; error: string };

/**
 * Issues a signed upload URL after checking the declared type and size and
 * the rate limit. Without SUPABASE_SERVICE_ROLE_KEY it returns `legacy` (the
 * previous public bucket) only where legacyUploadsAllowed(); else it refuses.
 */
export async function requestUpload(raw: { kind: UploadKind; type: string; size: number }): Promise<UploadTicket> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Invalid file.' };
  const { kind, type, size } = parsed.data;
  const rule = uploadRules[kind];
  if (!rule.mimes.includes(type)) return { ok: false, error: 'This file type is not allowed.' };
  if (size > rule.maxBytes) return { ok: false, error: `Files can be up to ${rule.maxBytes / 1024 / 1024} MB.` };
  if (!(await rateLimit(`upload:${await clientIp()}`, 20, 3600))) {
    return { ok: false, error: 'Too many uploads. Please try again later.' };
  }
  try {
    const ticket = await createSignedUpload(kind, type);
    if (ticket) return { ok: true, mode: 'signed', ...ticket };
  } catch (error) {
    console.error('Signed upload failed', error);
    return { ok: false, error: 'Upload is unavailable right now. Please try again or email us.' };
  }
  if (legacyUploadsAllowed()) return { ok: true, mode: 'legacy' };
  return { ok: false, error: 'Uploads are not available right now. Please email us your file.' };
}
