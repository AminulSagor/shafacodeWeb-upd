'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAdmin } from '@/lib/auth';
import { authenticate, bumpSessionVersion } from '@/lib/auth/admins';
import { sessionConfigured, sessionCookie, signSession, SESSION_COOKIE } from '@/lib/auth/session';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { signInSchema } from '@/lib/schemas/auth';

export type SignInState = {
  error?: string;
  fieldErrors?: Partial<Record<'email' | 'password', string>>;
  email?: string;
};

/** Only same-site admin paths, so `?next=` cannot send people elsewhere. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' ? value : '';
  return /^\/admin(\/|$|\?)/.test(next) && !next.startsWith('//') ? next : '/admin';
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email') ?? '',
    password: formData.get('password') ?? '',
    remember: formData.get('remember') === 'on',
  });
  const email = String(formData.get('email') ?? '');
  if (!parsed.success) {
    const fieldErrors: SignInState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as 'email' | 'password';
      fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors, email };
  }
  if (!sessionConfigured()) return { error: 'Sign-in is not configured on this server yet.', email };

  const ip = await clientIp();
  const id = parsed.data.email.toLowerCase();
  const allowed = (await rateLimit(`login-ip:${ip}`, 20, 15 * 60)) && (await rateLimit(`login-email:${id}`, 8, 15 * 60));
  if (!allowed) return { error: 'Too many attempts. Wait 15 minutes and try again.', email };

  const admin = await authenticate(parsed.data.email, parsed.data.password);
  if (!admin) return { error: 'That email and password do not match an admin account.', email };

  const token = await signSession({ sub: admin.id, v: admin.sessionVersion, role: admin.role });
  (await cookies()).set(sessionCookie(token, parsed.data.remember));
  redirect(safeNext(formData.get('next')));
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}

/** Revokes this admin's sessions on every device. */
export async function signOutEverywhere() {
  const admin = await getAdmin();
  if (admin) await bumpSessionVersion(admin.id);
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
