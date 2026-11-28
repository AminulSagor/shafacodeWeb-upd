import 'server-only';

import { revalidatePath } from 'next/cache';

import { requireAdmin, type AdminUser } from '@/lib/auth';
import { demoMode, live } from './source';

export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Wraps an admin mutation: checks the session, refuses in demo mode, turns
 * thrown errors into a message, and refreshes the admin pages.
 */
export async function adminAction<T = undefined>(
  run: (admin: AdminUser) => Promise<ActionResult<T> | void>,
  opts: { role?: 'owner'; revalidate?: string[] } = {}
): Promise<ActionResult<T>> {
  const admin = await requireAdmin(opts.role ? { role: opts.role } : {});
  if (demoMode()) return { ok: false, error: 'Demo data: Firestore is not configured, so nothing was saved.' };
  if (!live()) return { ok: false, error: 'Firestore is not configured.' };
  try {
    const result = (await run(admin)) ?? { ok: true };
    revalidatePath('/admin', 'layout');
    for (const path of opts.revalidate ?? []) revalidatePath(path);
    return result as ActionResult<T>;
  } catch (error) {
    console.error('Admin action failed', error);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}
