import 'server-only';

import { requireAdmin } from '@/lib/auth';
import { db, demoMode, iso, live, str } from './source';

export type AdminRow = { id: string; email: string; name: string; role: 'owner' | 'editor'; createdAt: string; lastLoginAt: string };

/** Admin accounts (owners only). Password hashes never leave this module. */
export async function listAdmins(): Promise<AdminRow[]> {
  const me = await requireAdmin({ role: 'owner' });
  if (demoMode()) return [{ id: me.id, email: me.email, name: me.name, role: 'owner', createdAt: '', lastLoginAt: new Date().toISOString() }];
  if (!live()) return [];
  const snap = await db().collection('admins').get();
  return snap.docs
    .map((d) => ({
      id: d.id,
      email: str(d.get('email')),
      name: str(d.get('name')),
      role: d.get('role') === 'owner' ? ('owner' as const) : ('editor' as const),
      createdAt: iso(d.get('createdAt')),
      lastLoginAt: iso(d.get('lastLoginAt')),
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
}
