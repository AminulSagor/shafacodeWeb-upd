import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { serviceHref, type Service } from '@/content/services';

export function CheckItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li className={cn('flex items-start gap-2.5 type-body-sm text-fg-muted', className)}>
      <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full text-icon-brand" aria-hidden>
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
      {children}
    </li>
  );
}

/**
 * Whole card links to the service page through a stretched link on the
 * title; the footer link sits on the shared bottom line (mt-auto).
 * Figma: Service Card 17:2693
 */
export function ServiceCard({ service, index, wide = false }: { service: Service; index: number; wide?: boolean }) {
  const Icon = service.icon;
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col gap-5 rounded-md border border-line-subtle bg-surface-1 p-[var(--card-pad)] transition-[border-color,translate] duration-[var(--duration-base)] ease-out hover:-translate-y-0.5 hover:border-line-brand md:p-[var(--card-pad-lg)]',
        wide && 'xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-x-16'
      )}
    >
      <div className={cn('flex flex-col gap-5', wide && 'xl:row-span-2')}>
        <div className="flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-sm text-icon-brand">
            <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="type-mono-sm text-fg-subtle tabular" aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="type-h3 text-fg">
            <Link href={serviceHref(service.slug)} className="rounded-sm after:absolute after:inset-0 focus-visible:focus-ring">
              {service.title}
            </Link>
          </h3>
          <p className="type-body text-fg-muted">{service.summary}</p>
        </div>
      </div>
      <div className={cn('flex flex-1 flex-col gap-5', wide && 'xl:justify-end')}>
        <ul className={cn('flex flex-col gap-2.5', wide && 'xl:grid xl:grid-cols-2 xl:gap-x-3')}>
          {service.highlights.map((h) => (
            <CheckItem key={h}>{h}</CheckItem>
          ))}
        </ul>
        <p className="flex flex-wrap gap-x-2.5 gap-y-1 type-mono-xs text-fg-subtle">
          {service.stack.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 type-label text-fg-brand" aria-hidden>
          {service.exploreLabel}
          <ArrowRight className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
