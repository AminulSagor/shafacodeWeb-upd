'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { prepareUsage } from '@/lib/admin/media-usage';
import { db } from '@/lib/admin/source';
import { issuesToFields } from '@/lib/schemas/admin/common';
import { testimonialSchema, type TestimonialInput } from '@/lib/schemas/admin/testimonial';

const idField = z.string().min(1).max(128).regex(/^[\w-]+$/);
const images = (d: { avatar?: { path?: string } | null; poster?: { path?: string } | null } | undefined) =>
  [d?.avatar?.path, d?.poster?.path].filter((p): p is string => !!p);

export async function saveTestimonial(rawId: string | null, input: TestimonialInput): Promise<ActionResult<{ id: string }>> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  if (rawId !== null && !idField.safeParse(rawId).success) return { ok: false, error: 'Invalid id.' };
  const d = parsed.data;
  return adminAction(async (admin): Promise<ActionResult<{ id: string }>> => {
    const ref = rawId ? db().collection('testimonials').doc(rawId) : db().collection('testimonials').doc();
    const now = Timestamp.now();
    await db().runTransaction(async (tx) => {
      const snap = rawId ? await tx.get(ref) : null;
      if (rawId && !snap?.exists) throw new Error('Testimonial not found');
      const video = d.type === 'video';
      const saved = { avatar: d.avatar, poster: video ? d.poster : null };
      const writeUsage = await prepareUsage(tx, `testimonial:${ref.id}`, images(snap?.data() as never), images(saved));
      tx.set(
        ref,
        {
          ...d,
          videoUrl: video ? d.videoUrl : '',
          poster: video ? d.poster : null,
          duration: video ? d.duration : '',
          updatedAt: now,
          updatedBy: admin.id,
          ...(snap ? {} : { createdAt: now }),
        },
        { merge: true }
      );
      writeUsage();
    });
    updateTag('testimonials');
    await logActivity(admin, `${rawId ? 'updated' : 'added'} the testimonial from ${d.clientName}`);
    return { ok: true, message: d.status === 'published' ? 'Saved and live' : 'Saved', data: { id: ref.id } };
  }, { revalidate: ['/'] });
}

export async function deleteTestimonial(rawId: string) {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection('testimonials').doc(parsed.data);
    let name = '';
    await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Testimonial not found');
      name = String(snap.get('clientName') ?? '');
      const writeUsage = await prepareUsage(tx, `testimonial:${ref.id}`, images(snap.data() as never), []);
      writeUsage();
      tx.delete(ref);
    });
    updateTag('testimonials');
    await logActivity(admin, `deleted the testimonial from ${name}`);
    return { ok: true, message: 'Testimonial deleted' };
  }, { revalidate: ['/'] });
}
