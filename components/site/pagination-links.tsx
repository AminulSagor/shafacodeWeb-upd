import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

function pages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, 2, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((n, i) => {
    const gap = i > 0 ? n - sorted[i - 1] : 1;
    if (gap === 2) out.push(n - 1); // a single hidden page is shown, not replaced by "…"
    else if (gap > 2) out.push('…');
    out.push(n);
  });
  return out;
}

const box =
  'grid size-9 place-items-center rounded-sm border type-label-sm transition-colors focus-visible:focus-ring';

/** Crawlable page links (`?page=n`). Figma: Pagination 14:2594 */
export function PaginationLinks({
  current,
  total,
  href,
  label = 'Pagination',
}: {
  current: number;
  total: number;
  href: (page: number) => string;
  label?: string;
}) {
  if (total <= 1) return null;
  return (
    <nav aria-label={label} className="flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          {current > 1 ? (
            <Link href={href(current - 1)} aria-label="Previous page" className={cn(box, 'border-line-subtle text-icon hover:text-fg')}>
              <ChevronLeft className="size-4" aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className={cn(box, 'border-line-subtle text-fg-disabled')}>
              <ChevronLeft className="size-4" />
            </span>
          )}
        </li>
        {pages(current, total).map((p, i) =>
          p === '…' ? (
            <li key={`gap-${i}`} aria-hidden className={cn(box, 'border-line-subtle text-fg-subtle')}>
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={href(p)}
                aria-current={p === current ? 'page' : undefined}
                className={cn(
                  box,
                  p === current
                    ? 'border-brand-soft-border bg-brand-soft text-fg-brand'
                    : 'border-line-subtle text-fg-muted hover:text-fg'
                )}
              >
                {p}
              </Link>
            </li>
          )
        )}
        <li>
          {current < total ? (
            <Link href={href(current + 1)} aria-label="Next page" className={cn(box, 'border-line-subtle text-icon hover:text-fg')}>
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className={cn(box, 'border-line-subtle text-fg-disabled')}>
              <ChevronRight className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
