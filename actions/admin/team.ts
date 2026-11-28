'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { prepareUsage } from '@/lib/admin/media-usage';
import { db } from '@/lib/admin/source';
import { issuesToFields } from '@/lib/schemas/admin/common';
import { teamSchema, type TeamInput } from '@/lib/schemas/admin/team';

const idField = z.string().min(1).max(128).regex(/^[\w-]+$/);
const photo = (d: { photo?: { path?: string } | null } | undefined) => (d?.photo?.path ? [d.photo.path] : []);

export async function saveTeamMember(rawId: string | null, input: TeamInput): Promise<ActionResult<{ id: string }>> {
  const parsed = teamSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  if (rawId !== null && !idField.safeParse(rawId).success) return { ok: false, error: 'Invalid id.' };
  const d = parsed.data;
  return adminAction(async (admin): Promise<ActionResult<{ id: string }>> => {
    const col = db().collection('team');
    const ref = rawId ? col.doc(rawId) : col.doc();
    const last = rawId ? null : await col.orderBy('order', 'desc').limit(1).get();
    const now = Timestamp.now();
    await db().runTransaction(async (tx) => {
      const snap = rawId ? await tx.get(ref) : null;
      if (rawId && !snap?.exists) throw new Error('Team member not found');
      const writeUsage = await prepareUsage(tx, `team:${ref.id}`, photo(snap?.data() as never), photo(d));
      tx.set(
        ref,
        {
          ...d,
          updatedAt: now,
          ...(snap ? {} : { createdAt: now, order: (Number(last?.docs[0]?.get('order')) || 0) + 1 }),
        },
        { merge: true }
      );
      writeUsage();
    });
    updateTag('team');
    await logActivity(admin, `${rawId ? 'updated' : 'added'} team member ${d.name}`);
    return { ok: true, message: 'Saved', data: { id: ref.id } };
  }, { revalidate: ['/about'] });
}

/** Saves the display order from the reorder list. */
export async function reorderTeam(rawIds: string[]) {
  const parsed = z.array(idField).max(200).safeParse(rawIds);
  if (!parsed.success) return { ok: false as const, error: 'Invalid order.' };
  return adminAction(async () => {
    const batch = db().batch();
    parsed.data.forEach((id, i) => batch.update(db().collection('team').doc(id), { order: i }));
    await batch.commit();
    updateTag('team');
    return { ok: true, message: 'Order saved' };
  }, { revalidate: ['/about'] });
}

export async function deleteTeamMember(rawId: string) {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection('team').doc(parsed.data);
    const posts = await db().collection('blogs').where('authorId', '==', parsed.data).limit(1).get();
    if (!posts.empty) return { ok: false, error: 'This person is the author of blog posts. Pick another author on those posts first, or hide them instead.' };
    let name = '';
    await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Team member not found');
      name = String(snap.get('name') ?? '');
      const writeUsage = await prepareUsage(tx, `team:${ref.id}`, photo(snap.data() as never), []);
      writeUsage();
      tx.delete(ref);
    });
    updateTag('team');
    await logActivity(admin, `removed team member ${name}`);
    return { ok: true, message: 'Removed' };
  }, { revalidate: ['/about'] });
}
