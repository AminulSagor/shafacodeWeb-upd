import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Briefcase, FileText, Folder, Monitor } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { OctopusIllustration } from '@/components/site/octopus-illustration';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const quickLinks = [
  { title: 'Services', body: 'What we build', href: '/services', icon: Monitor },
  { title: 'Portfolio', body: 'Recent work', href: '/portfolio', icon: Folder },
  { title: 'Blog', body: 'Guides and insights', href: '/blogs', icon: FileText },
  { title: 'Careers', body: 'Open roles', href: '/careers', icon: Briefcase },
];

/** Branded 404. Figma: 404 52:8730 (mobile 53:17536) */
export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative isolate pt-12 pb-[var(--section-y)] md:pt-20 xl:pt-[104px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[var(--nav-height)] -z-10 h-[900px] bg-[radial-gradient(50%_50%_at_50%_30%,var(--brand-glow)_0%,transparent_100%)] opacity-30 max-md:opacity-20"
      />
      <div className="container-page flex flex-col items-center text-center">
        <OctopusIllustration className="h-auto w-[260px] md:w-[360px]" />
        <Eyebrow className="mt-6">Error 404</Eyebrow>
        <h1 id="nf-title" className="mt-6 max-w-[900px] type-display text-fg">
          This page got <Accent>tangled up</Accent>
        </h1>
        <p className="mt-6 max-w-[620px] type-body-lg text-fg-muted">
          The link may be broken or the page may have moved. Let our octopus point you somewhere useful.
        </p>
        <div className="mt-8 flex flex-col gap-3 max-md:w-full sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              Back to home <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
      <nav aria-label="Popular pages" className="container-page mt-10">
        <ul className="grid gap-[var(--grid-gap)] sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map(({ title, body, href, icon: Icon }) => (
            <li
              key={href}
              className="group card-focus relative flex flex-col rounded-panel border border-line-subtle bg-surface-1 p-[var(--card-pad)] transition-colors duration-[var(--duration-base)] hover:border-line xl:min-h-[212px] xl:p-10"
            >
              <Icon className="size-5 text-icon-brand" strokeWidth={1.75} aria-hidden />
              <h2 className="mt-6 type-h4 text-fg xl:mt-auto">
                <Link href={href} className="after:absolute after:inset-0">
                  {title}
                </Link>
              </h2>
              <p className="mt-2 type-body-sm text-fg-subtle">{body}</p>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
