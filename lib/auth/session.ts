import { jwtVerify, SignJWT } from 'jose';

/**
 * Signed admin session (HS256, `SESSION_SECRET`). Holds the admin id and the
 * `sessionVersion`; bumping the version in Firestore revokes every token.
 * No `server-only` import: `proxy.ts` uses this too.
 */
export const SESSION_COOKIE = 'sc_session';
export const SESSION_MAX_AGE = 8 * 60 * 60;

export type AdminRole = 'owner' | 'editor';
export type SessionPayload = { sub: string; v: number; role: AdminRole };

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

export const sessionConfigured = () => secret() !== null;

export async function signSession(p: SessionPayload) {
  const key = secret();
  if (!key) throw new Error('SESSION_SECRET must be set (32+ characters)');
  return new SignJWT({ v: p.v, role: p.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(p.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function readSession(token: string | undefined): Promise<SessionPayload | null> {
  const key = secret();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string' || typeof payload.v !== 'number') return null;
    return { sub: payload.sub, v: payload.v, role: payload.role === 'owner' ? 'owner' : 'editor' };
  } catch {
    return null;
  }
}

export function sessionCookie(token: string, persistent: boolean) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    ...(persistent ? { maxAge: SESSION_MAX_AGE } : {}),
  };
}
