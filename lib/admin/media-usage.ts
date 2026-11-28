import 'server-only';

import { FieldValue, type QueryDocumentSnapshot, type Transaction } from 'firebase-admin/firestore';

import { db } from './source';

/**
 * Reads the media docs for the given paths inside a transaction and returns a
 * writer that records which item uses them (Media.usedIn), so the library can
 * show usage and block deleting images still in use. Reads first, then writes,
 * as transactions require.
 */
export async function prepareUsage(tx: Transaction, usageKey: string, before: string[], after: string[]) {
  const paths = [...new Set([...before, ...after])].filter((p) => p && !p.startsWith('/'));
  const docs: QueryDocumentSnapshot[] = [];
  for (let i = 0; i < paths.length; i += 30) {
    const snap = await tx.get(db().collection('media').where('path', 'in', paths.slice(i, i + 30)));
    docs.push(...snap.docs);
  }
  const keep = new Set(after);
  return () => {
    for (const d of docs) {
      const path = String(d.get('path'));
      tx.update(d.ref, { usedIn: keep.has(path) ? FieldValue.arrayUnion(usageKey) : FieldValue.arrayRemove(usageKey) });
    }
  };
}
