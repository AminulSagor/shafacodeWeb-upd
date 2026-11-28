import { NextResponse, type NextRequest } from 'next/server';

import { readSession, SESSION_COOKIE } from '@/lib/auth/session';

/**
 * Fast check only: a valid signature. `requireAdmin()` does the real check
 * (sessionVersion in Firestore) in every admin page and action.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (pathname.startsWith('/admin') && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname + search);
    const res = NextResponse.redirect(url);
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = { matcher: ['/admin/:path*', '/login'] };
