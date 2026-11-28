import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { JsonLd } from '@/components/site/json-ld';
import { breadcrumbLd } from '@/lib/structured-data';

export type Crumb = { name: string; path: string };

/**
 * Breadcrumbs with BreadcrumbList JSON-LD from the same data.
 * The last crumb is the current page. Figma: Breadcrumbs 14:2586
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: 'Home', path: '/' }, ...items.filter((c) => c.path !== '/')];
  if (all.length < 2) return null;
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 type-body-sm">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-icon-muted" aria-hidden />}
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {c.name}
                  </span>
                ) : (
                  <Link
                    href={c.path}
                    className="inline-flex min-h-6 items-center rounded-sm text-fg-subtle transition-colors hover:text-fg focus-visible:focus-ring"
                  >
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
