import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Breadcrumbs, type Crumb } from '@/components/site/breadcrumbs';

type PageHeroProps = {
  crumbs: Crumb[];
  eyebrow: string;
  /** H1 content; put the accent phrase in <Accent>. */
  title: React.ReactNode;
  lede?: string;
  /** Buttons or other actions under the lede */
  actions?: React.ReactNode;
  /** Optional content to the right (desktop) or below (mobile) */
  aside?: React.ReactNode;
  className?: string;
  titleClassName?: string;
};

/**
 * Inner page hero: breadcrumb, bracketed eyebrow, left-aligned H1 with one
 * serif accent, lede and actions over a soft top-left glow.
 * Figma: Page Hero 19:2838
 */
export function PageHero({ crumbs, eyebrow, title, lede, actions, aside, className, titleClassName }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className={cn('relative isolate', className)}>
      {/* Glow: clipped horizontally only, so it never causes sideways scroll */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-nav -z-10 h-225 overflow-x-clip">
        <div className="absolute top-0 left-[calc(50%_-_--spacing(275))] h-full w-350 bg-glow opacity-20 max-md:-left-75 max-md:opacity-15" />
      </div>
      <div
        className={cn(
          'container-page pt-hero-top pb-hero-bottom',
          aside && 'grid gap-10 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end'
        )}
      >
        <div className="flex max-w-220 flex-col items-start">
          <Breadcrumbs items={crumbs} />
          <Eyebrow className="mt-6">{eyebrow}</Eyebrow>
          <h1 id="page-title" className={cn('mt-5 type-h1 text-fg', titleClassName)}>
            {title}
          </h1>
          {lede && <p className="mt-5 type-body-lg text-fg-muted">{lede}</p>}
          {actions && <div className="mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
