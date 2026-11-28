'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { listMedia, type MediaItem } from '@/lib/admin/media';
import { db } from '@/lib/admin/source';
import { requireAdmin } from '@/lib/auth';
import { publicMediaUrl } from '@/lib/media';
import { createSignedUpload, storageAdmin, uploadRules, verifyUpload } from '@/lib/storage';

const id = z.string().min(1).max(128).regex(/^[\w-]+$/);

/** Library items for the media picker. */
export async function pickerMedia(): Promise<MediaItem[]> {
  return listMedia();
}

/** A signed upload URL for the public media bucket (admins only). */
export async function requestMediaUpload(raw: { type: string; size: number }): Promise<ActionResult<{ path: string; signedUrl: string }>> {
  await requireAdmin();
  const rule = uploadRules.media;
  if (!rule.mimes.includes(raw.type)) return { ok: false, error: 'Use a PNG, JPG or WebP image (no SVG).' };
  if (!(raw.size > 0 && raw.size <= rule.maxBytes)) return { ok: false, error: 'Images can be up to 8 MB.' };
  if (!storageAdmin()) return { ok: false, error: 'Image upload needs SUPABASE_SERVICE_ROLE_KEY on the server.' };
  try {
    const ticket = await createSignedUpload('media', raw.type);
    return ticket ? { ok: true, data: { path: ticket.path, signedUrl: ticket.signedUrl } } : { ok: false, error: 'Upload is not available.' };
  } catch (error) {
    console.error('Media upload ticket failed', error);
    return { ok: false, error: 'Upload is not available right now.' };
  }
}

const registerInput = z.object({
  path: z.string().min(1).max(200),
  alt: z.string().trim().max(250),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
  size: z.number().int().positive(),
  type: z.string().max(40),
});

/** Verifies the uploaded file (magic bytes, size) and adds it to the library. */
export async function registerMedia(raw: z.input<typeof registerInput>) {
  const parsed = registerInput.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: 'Invalid image details.' };
  return adminAction<MediaItem>(async (admin) => {
    if (!(await verifyUpload('media', parsed.data.path))) return { ok: false, error: 'The file is not a valid PNG, JPG or WebP image.' };
    const ref = await db().collection('media').add({ ...parsed.data, usedIn: [], createdAt: FieldValue.serverTimestamp(), uploadedBy: admin.id });
    await logActivity(admin, 'uploaded an image');
    return {
      ok: true,
      message: 'Image uploaded',
      data: { id: ref.id, ...parsed.data, url: publicMediaUrl(parsed.data.path), usedIn: [], createdAt: new Date().toISOString() },
    };
  });
}

export async function updateMediaAlt(rawId: string, rawAlt: string) {
  const parsed = z.object({ id, alt: z.string().trim().max(250) }).safeParse({ id: rawId, alt: rawAlt });
  if (!parsed.success) return { ok: false as const, error: 'Alt text can be up to 250 characters.' };
  return adminAction(async () => {
    await db().collection('media').doc(parsed.data.id).update({ alt: parsed.data.alt, updatedAt: FieldValue.serverTimestamp() });
    return { ok: true, message: 'Alt text saved' };
  }, { revalidate: ['/admin/media'] });
}

/** Deletes an unused image from the library and the bucket; refuses while it is in use. */
export async function deleteMedia(rawId: string) {
  const parsed = id.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection('media').doc(parsed.data);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This image no longer exists.' };
    const used = (snap.get('usedIn') as string[] | undefined) ?? [];
    if (used.length) return { ok: false, error: `This image is used by ${used.length} item${used.length > 1 ? 's' : ''}. Replace it there first.` };
    const path = String(snap.get('path') ?? '');
    if (path && !/^https?:/.test(path)) await storageAdmin()?.storage.from('media').remove([path]);
    await ref.delete();
    await logActivity(admin, 'deleted an image');
    return { ok: true, message: 'Image deleted' };
  });
}
