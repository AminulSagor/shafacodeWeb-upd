import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/ui/eyebrow';

type SectionHeaderProps = {
  eyebrow: string;
  /** Heading content; put the accent phrase in <Accent>. */
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** id for aria-labelledby on the section */
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
  /** Extra content on the right instead of (or under) the lede, e.g. a button */
  aside?: React.ReactNode;
  /** Put the lede under the heading instead of in the right column */
  ledeBelow?: boolean;
};

/**
 * Editorial section header: top hairline, `[ EYEBROW ]`, left-aligned heading
 * with one serif accent, lede in a right column on desktop (wraps below on
 * mobile). Figma: Section Header 19:2769
 */
export function SectionHeader({ eyebrow, title, lede, id, as: H = 'h2', className, aside, ledeBelow = false }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 border-t border-line-subtle pt-7 xl:flex-row xl:items-start xl:justify-between xl:gap-x-10',
        className
      )}
    >
      <div className="flex max-w-215 min-w-0 flex-1 flex-col gap-5">
        <div data-reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <H id={id} data-reveal="clip" style={{ '--reveal-i': 1 } as React.CSSProperties} className={cn(H === 'h1' ? 'type-h1' : 'type-h2', 'text-fg')}>
          {title}
        </H>
        {ledeBelow && lede && (
          <p data-reveal style={{ '--reveal-i': 2 } as React.CSSProperties} className="max-w-160 type-body-lg text-fg-muted">
            {lede}
          </p>
        )}
      </div>
      {((lede && !ledeBelow) || aside) && (
        <div data-reveal style={{ '--reveal-i': 2 } as React.CSSProperties} className="flex max-w-140 flex-col gap-5 xl:w-100 xl:max-w-100 xl:shrink-0">
          {lede && !ledeBelow && <p className="type-body-lg text-fg-muted">{lede}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}
