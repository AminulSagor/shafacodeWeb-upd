import 'server-only';

import type { DocumentData, Transaction } from 'firebase-admin/firestore';

import { db } from './source';

/**
 * True when another document in the collection uses `slug` now or as an old
 * slug (which would make its redirect point somewhere else). Runs inside the
 * save transaction so two saves cannot take the same slug.
 */
export async function slugTaken(tx: Transaction, collection: string, slug: string, selfId: string) {
  const col = db().collection(collection);
  const [now, old] = await Promise.all([
    tx.get(col.where('slug', '==', slug).limit(2)),
    tx.get(col.where('previousSlugs', 'array-contains', slug).limit(2)),
  ]);
  return [...now.docs, ...old.docs].some((d) => d.id !== selfId);
}

/** Old slugs to keep: the previous live slug when it changes, never the current one. */
export function nextPreviousSlugs(before: DocumentData | undefined, oldLiveSlug: string | null, slug: string) {
  const list = Array.isArray(before?.previousSlugs) ? (before!.previousSlugs as unknown[]).filter((s): s is string => typeof s === 'string') : [];
  if (oldLiveSlug && oldLiveSlug !== slug) list.push(oldLiveSlug);
  return [...new Set(list)].filter((s) => s !== slug).slice(-20);
}
