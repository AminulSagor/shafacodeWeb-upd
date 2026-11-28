import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/site/brand-logo';
import { techVisual } from '@/content/tech';

/** Compact tech tile: logo and name. Figma: Tech Tile 18:2858 (inline variant) */
export function TechTile({ name, className }: { name: string; className?: string }) {
  const v = techVisual(name);
  return (
    <span className={cn('inline-flex h-14 items-center gap-3 pr-4 type-label-sm text-fg', className)}>
      <span className="grid size-8 shrink-0 place-items-center text-icon-strong">
        {'brand' in v ? (
          <BrandLogo name={v.brand} className="size-6" />
        ) : (
          <v.icon className="size-6" strokeWidth={1.5} aria-hidden />
        )}
      </span>
      {name}
    </span>
  );
}
