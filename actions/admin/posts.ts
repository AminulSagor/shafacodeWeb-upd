'use server';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { prepareUsage } from '@/lib/admin/media-usage';
import { db } from '@/lib/admin/source';
import { readingMinutes } from '@/lib/data/posts';
import { dhakaDate, issuesToFields } from '@/lib/schemas/admin/common';
import { postSchema, type PostInput } from '@/lib/schemas/admin/post';

const idField = z.string().min(1).max(128).regex(/^[\w-]+$/);
const coverPath = (d: { cover?: { path?: string } | null } | undefined) => (d?.cover?.path ? [d.cover.path] : []);

export async function savePost(rawId: string | null, input: PostInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  if (rawId !== null && !idField.safeParse(rawId).success) return { ok: false, error: 'Invalid id.' };
  const d = parsed.data;

  return adminAction(async (admin): Promise<ActionResult<{ id: string; slug: string }>> => {
    const col = db().collection('blogs');
    const clash = await col.where('slug', '==', d.slug).limit(2).get();
    if (clash.docs.some((doc) => doc.id !== rawId)) return { ok: false, error: 'That URL slug is taken.', fieldErrors: { slug: 'Another post uses this slug.' } };

    // Author snapshot: the site renders it without reading the team collection.
    const authorSnap = d.authorId ? await db().collection('team').doc(d.authorId).get() : null;
    const author = authorSnap?.exists
      ? { name: String(authorSnap.get('name') ?? ''), role: String(authorSnap.get('role') ?? ''), bio: String(authorSnap.get('bio') ?? ''), photo: String(authorSnap.get('photo.path') ?? '') || null }
      : null;
    if (d.authorId && !author) return { ok: false, error: 'That author no longer exists.', fieldErrors: { authorId: 'Pick another author.' } };

    const ref = rawId ? col.doc(rawId) : col.doc();
    const now = Timestamp.now();
    const when = dhakaDate(d.publishAt);

    await db().runTransaction(async (tx) => {
      const snap = rawId ? await tx.get(ref) : null;
      if (rawId && !snap?.exists) throw new Error('Post not found');
      const before = snap?.data();
      const writeUsage = await prepareUsage(tx, `post:${ref.id}`, coverPath(before as never), coverPath(d));
      const wasLive = before && (!before.status || before.status === 'published');
      const publishedAt =
        d.status === 'scheduled' || (d.status === 'published' && when)
          ? Timestamp.fromDate(when ?? new Date())
          : d.status === 'published'
            ? (before?.publishedAt ?? now)
            : (before?.publishedAt ?? null);
      tx.set(
        ref,
        {
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          category: d.category,
          tags: d.tags,
          authorId: d.authorId,
          author,
          cover: d.cover,
          slug: d.slug,
          seo: d.seo,
          status: d.status,
          isFeatured: d.isFeatured,
          readingMinutes: readingMinutes(d.content),
          publishedAt,
          updatedAt: now,
          updatedBy: admin.id,
          ...(snap ? {} : { createdAt: now, previousSlugs: [] }),
          ...(before?.slug && before.slug !== d.slug && wasLive ? { previousSlugs: FieldValue.arrayUnion(before.slug) } : {}),
          // The old admin stored a full URL here; the cover object replaces it.
          ...(before?.coverImage ? { coverImage: FieldValue.delete() } : {}),
        },
        { merge: true }
      );
      writeUsage();
    });

    updateTag('blogs');
    await logActivity(admin, `${d.status === 'published' ? 'published' : rawId ? 'updated' : 'drafted'} “${d.title}”`);
    return { ok: true, message: d.status === 'draft' ? 'Draft saved' : d.status === 'scheduled' ? 'Scheduled' : 'Saved and live', data: { id: ref.id, slug: d.slug } };
  }, { revalidate: ['/blogs'] });
}

export async function deletePost(rawId: string) {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection('blogs').doc(parsed.data);
    let title = '';
    await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Post not found');
      title = String(snap.get('title') ?? '');
      const writeUsage = await prepareUsage(tx, `post:${ref.id}`, coverPath(snap.data() as never), []);
      writeUsage();
      tx.delete(ref);
    });
    updateTag('blogs');
    await logActivity(admin, `deleted the post “${title}”`);
    return { ok: true, message: 'Post deleted' };
  }, { revalidate: ['/blogs'] });
}
