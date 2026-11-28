import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { serviceHref, type Service } from '@/content/services';

export function CheckItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li className={cn('flex items-start gap-2.5 type-body-sm text-fg-muted', className)}>
      <Check className="mt-0.5 size-4 shrink-0 text-icon-brand" strokeWidth={2.5} aria-hidden />
      {children}
    </li>
  );
}

/**
 * Whole card links to the service page through a stretched link on the
 * title (the accessible name, per the Figma annotation); the focus ring goes
 * around the card and the footer CTA sits on the shared bottom line.
 * `wide` lays the card out in two columns (header row on top) from 768px.
 * Figma: Service Card 17:2693
 */
export function ServiceCard({
  service,
  index,
  wide = false,
  headingLevel: H = 'h3',
}: {
  service: Service;
  index: number;
  wide?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Icon = service.icon;
  return (
    <article
      data-reveal
      data-spotlight
      className={cn(
        'group card-focus relative flex h-full flex-col gap-5 rounded-md border border-line-subtle bg-surface-1 p-card transition-[border-color,translate] duration-(--duration-base) ease-out hover:border-line-brand motion-safe:hover:-translate-y-0.5 md:p-card-lg',
        wide && 'md:grid md:grid-cols-2 md:gap-x-12 xl:gap-x-16'
      )}
    >
      <div className={cn('flex items-center justify-between', wide && 'md:col-span-2')}>
        <span className="grid size-12 place-items-center text-icon-brand">
          <Icon className="size-5.5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="type-mono-sm text-fg-subtle tabular" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <H className="type-h3 text-fg">
          <Link href={serviceHref(service.slug)} className="after:absolute after:inset-0">
            {service.title}
          </Link>
        </H>
        <p className="type-body text-fg-muted">{service.summary}</p>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <ul className={cn('flex flex-col gap-2.5', wide && 'xl:grid xl:grid-cols-2 xl:gap-x-3')}>
          {service.highlights.map((h) => (
            <CheckItem key={h}>{h}</CheckItem>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-2.5 gap-y-1 type-mono-xs text-fg-subtle" aria-label="Technologies">
          {service.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 type-label text-fg-brand" aria-hidden>
          {service.exploreLabel}
          <ArrowRight className="size-4 shrink-0 transition-transform duration-(--duration-fast) motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
