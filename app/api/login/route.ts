import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies(); // <-- await here

  const form = await req.formData();
  const username = form.get('username');
  const password = form.get('password');

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return new Response('OK', { status: 200 });
  }

  return new Response('Unauthorized', { status: 401 });
}
