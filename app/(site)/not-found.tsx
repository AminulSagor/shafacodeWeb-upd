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
    <section aria-labelledby="nf-title" className="relative isolate pt-12 pb-section md:pt-20 xl:pt-26">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-nav -z-10 h-225 bg-glow opacity-30 max-md:opacity-20"
      />
      <div className="container-page flex flex-col items-center text-center">
        <OctopusIllustration className="h-auto w-65 md:w-90" />
        <Eyebrow className="mt-6">Error 404</Eyebrow>
        <h1 id="nf-title" className="mt-6 max-w-225 type-display text-fg">
          This page got <Accent>tangled up</Accent>
        </h1>
        <p className="mt-6 max-w-155 type-body-lg text-fg-muted">
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
        <ul className="grid gap-grid sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map(({ title, body, href, icon: Icon }) => (
            <li
              key={href}
              className="group card-focus relative flex flex-col rounded-panel border border-line-subtle bg-surface-1 p-card transition-colors duration-(--duration-base) hover:border-line xl:min-h-53 xl:p-10"
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
