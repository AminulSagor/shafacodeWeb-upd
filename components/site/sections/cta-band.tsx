import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Accent } from '@/components/ui/accent';

const trust = ['Reply within 12 hours', 'Fixed milestones and pricing', 'You own the source code'];

const steps = [
  {
    title: 'Share your requirements',
    body: 'Tell us about your project, business goal or idea through a quick form or message.',
  },
  {
    title: 'Get a clear plan',
    body: 'We review your needs and prepare the right scope, timeline and estimated budget.',
  },
  {
    title: "Let's build it",
    body: 'Once everything is aligned, we kick off with clear communication and milestones.',
  },
];

/**
 * Final call to action over a soft radial lime glow (the glow fades to fully
 * transparent inside its own box, so nothing clips it). Figma: CTA Band 19:2839
 */
export function CtaBand({
  title = (
    <>
      Have an idea? Let&apos;s build it <Accent>clearly and reliably</Accent>.
    </>
  ),
  body = 'Tell us what you want to build. We will help you understand the scope, timeline, budget and best technical direction.',
  showSteps = true,
}: {
  title?: React.ReactNode;
  body?: string;
  showSteps?: boolean;
}) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate section-y">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_45%,var(--brand-glow)_0%,transparent_100%)] opacity-40 max-md:opacity-25"
      />
      <div className="container-page flex flex-col items-center text-center">
        <Eyebrow>Start your journey</Eyebrow>
        <h2 id="cta-title" className="mt-5 max-w-[720px] type-h2 text-fg">
          {title}
        </h2>
        <p className="mt-6 max-w-[560px] type-body-lg text-fg-muted">{body}</p>
        <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link href="/contact?type=consultation">
              Book a free consultation <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact?type=estimate">Request project estimate</Link>
          </Button>
        </div>
        <ul className="mt-8 flex flex-col items-center gap-x-8 gap-y-3 md:flex-row">
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-2 type-body-sm text-fg-muted">
              <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-icon-brand" aria-hidden>
                <Check className="size-3" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
        {showSteps && (
          <ol className="mt-10 grid w-full max-w-[1160px] border-t border-line-subtle text-left md:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="border-line-subtle py-7 max-md:border-b md:border-l md:px-8 md:first:border-l-0 md:first:pl-0 xl:px-10 xl:first:pl-10"
              >
                <p className="type-mono-xs text-fg-brand">[ 0{i + 1} ]</p>
                <h3 className="mt-3 type-h5 text-fg">{s.title}</h3>
                <p className="mt-2 type-body-sm text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
