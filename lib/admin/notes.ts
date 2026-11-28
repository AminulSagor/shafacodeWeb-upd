import 'server-only';

import { requireAdmin } from '@/lib/auth';
import { db, demoMode, iso, live, str } from './source';

export type Note = { id: string; author: string; text: string; createdAt: string };

/** Team notes in `<collection>/<id>/notes`, oldest first. */
export async function listNotes(collection: 'contact' | 'apply-jobs' | 'affiliate-leads', id: string): Promise<Note[]> {
  await requireAdmin();
  if (demoMode()) {
    return id.endsWith('-1')
      ? [{ id: 'd-note-1', author: 'Sagor', text: 'Strong fit. Asked for their current tools before the call.', createdAt: new Date(Date.now() - 3600_000).toISOString() }]
      : [];
  }
  if (!live()) return [];
  const snap = await db().collection(collection).doc(id).collection('notes').orderBy('createdAt', 'asc').limit(100).get();
  return snap.docs.map((d) => ({ id: d.id, author: str(d.get('author')) || 'Admin', text: str(d.get('text')), createdAt: iso(d.get('createdAt')) }));
}
