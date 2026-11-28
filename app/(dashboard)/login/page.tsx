import type { Metadata } from 'next';

import { LoginForm } from '@/components/admin/auth/login-form';
import { Logo } from '@/components/site/logo';
import { StaticKineticDiagram } from '@/components/site/process/process-diagram';
import { redirect } from 'next/navigation';

import { getAdmin } from '@/lib/auth';
import { first, type RawSearchParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Sign in' };

/** Admin sign-in. Figma: Login 55:2397 (mobile 62:9408) */
export default async function LoginPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  if (await getAdmin()) redirect('/admin');
  const next = first((await searchParams).next) ?? '/admin';
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside data-theme="dark" className="relative hidden flex-col justify-between overflow-hidden bg-canvas p-12 text-fg lg:flex">
        <Logo />
        <div aria-hidden className="pointer-events-none relative h-63 xl:h-80 hd:h-84">
          <div className="absolute top-0 left-1/2 w-310 origin-top -translate-x-1/2 scale-33 xl:scale-42 hd:scale-44">
            <StaticKineticDiagram />
          </div>
        </div>
        <figure>
          <blockquote className="max-w-130 type-h3 text-fg">&ldquo;Every milestone, decision and update stays clear.&rdquo;</blockquote>
          <figcaption className="mt-4 type-mono-xs text-fg-subtle">ShafaCode · Agency admin</figcaption>
        </figure>
      </aside>
      <main id="main" className="flex items-center justify-center px-4 py-12 sm:px-6">
        <LoginForm next={next} />
      </main>
    </div>
  );
}
