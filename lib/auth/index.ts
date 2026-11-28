import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { findAdmin, type AdminUser } from './admins';
import { readSession, SESSION_COOKIE } from './session';

export type { AdminUser } from './admins';

/** The signed-in admin for this request (verified JWT plus sessionVersion in Firestore). */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return findAdmin(session.sub, session.v);
});

/**
 * Call in every admin page, server action, route handler and data loader:
 * the layout alone does not protect server actions.
 */
export async function requireAdmin(opts: { role?: 'owner' } = {}): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect('/login');
  if (opts.role === 'owner' && admin.role !== 'owner') redirect('/admin?denied=1');
  return admin;
}
