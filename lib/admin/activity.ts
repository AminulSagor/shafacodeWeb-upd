import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';

import { requireAdmin, type AdminUser } from '@/lib/auth';
import { demoActivity } from './demo';
import { db, demoMode, iso, live, str } from './source';
import type { ActivityEvent } from './types';

/** Records an admin action for the dashboard feed. Never throws. */
export async function logActivity(admin: AdminUser, text: string) {
  if (!live()) return;
  try {
    await db().collection('activity').add({ actorId: admin.id, actor: admin.name, text, at: FieldValue.serverTimestamp() });
  } catch (error) {
    console.error('Activity log failed', error);
  }
}

/** Latest events (admins only). */
export async function recentActivity(limit = 6): Promise<ActivityEvent[]> {
  await requireAdmin();
  if (demoMode()) return demoActivity.slice(0, limit);
  if (!live()) return [];
  try {
    const snap = await db().collection('activity').orderBy('at', 'desc').limit(limit).get();
    return snap.docs.map((doc) => ({ id: doc.id, actor: str(doc.get('actor')) || 'Someone', text: str(doc.get('text')), at: iso(doc.get('at')) }));
  } catch (error) {
    console.error('Activity read failed', error);
    return [];
  }
}
