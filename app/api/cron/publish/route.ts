import { timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';

/**
 * Scheduled publishing (Vercel Cron, every 15 minutes): flips case studies
 * and posts whose time has come from "scheduled" to "published" and refreshes
 * the caches. The public loaders already show due items; this keeps the
 * stored status and the admin lists accurate. Protected by CRON_SECRET.
 */
function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get('authorization') ?? '';
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response('Unauthorized', { status: 401 });
  if (!hasFirebaseCredentials()) return Response.json({ ok: false, reason: 'Firestore not configured' }, { status: 503 });
  const now = new Date();
  const result: Record<string, number> = {};
  for (const [collection, tag, path] of [
    ['projects', 'projects', '/portfolio'],
    ['blogs', 'blogs', '/blogs'],
  ] as const) {
    const due = await getDb().collection(collection).where('status', '==', 'scheduled').where('publishedAt', '<=', now).get();
    if (!due.empty) {
      const batch = getDb().batch();
      due.docs.forEach((d) => batch.update(d.ref, { status: 'published', updatedAt: now }));
      await batch.commit();
      revalidateTag(tag, { expire: 0 });
      revalidatePath(path);
    }
    result[collection] = due.size;
  }
  return Response.json({ ok: true, published: result });
}
