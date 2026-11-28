import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { listHref, type ListQuery } from '@/lib/admin/list';

/** Status tabs with counts; links keep the other filters. Figma: tabs in Contact Inquiries 55:3358 */
export function StatusTabs({
  base,
  query,
  param = 'status',
  tabs,
}: {
  base: string;
  query: ListQuery;
  param?: string;
  tabs: { value?: string; label: string; count: number }[];
}) {
  const current = query.get(param);
  return (
    <nav aria-label="Filter by status" className="overflow-x-auto border-b border-line-subtle px-5">
      <ul className="flex w-max gap-6">
        {tabs.map((t) => {
          const active = (t.value ?? undefined) === current;
          return (
            <li key={t.label}>
              <Link
                href={listHref(base, query.params, { [param]: t.value })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  '-mb-px flex items-center gap-1.5 border-b-2 py-4 type-label whitespace-nowrap focus-visible:focus-ring',
                  active ? 'border-fg text-fg' : 'border-transparent text-fg-muted hover:text-fg'
                )}
              >
                {t.label} <span className="tabular">{t.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** GET search form; keeps filters as hidden fields. */
export function SearchBox({ base, query, label, placeholder }: { base: string; query: ListQuery; label: string; placeholder: string }) {
  const keep = Object.entries(query.params).filter(([k, v]) => v && !['q', 'page', 'id'].includes(k));
  return (
    <form action={base} method="get" role="search" className="relative w-full md:max-w-90">
      {keep.map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={Array.isArray(v) ? v[0] : v} />
      ))}
      <label htmlFor={`${base}-q`} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-icon" aria-hidden />
      <Input key={query.q ?? ''} id={`${base}-q`} name="q" type="search" defaultValue={query.q} placeholder={placeholder} className="pl-10" />
    </form>
  );
}

/** "Showing 1 to 10 of 184" and numbered page links. */
export function Pagination({
  base,
  query,
  page,
  pages,
  total,
  size,
  noun,
}: {
  base: string;
  query: ListQuery;
  page: number;
  pages: number;
  total: number;
  size: number;
  noun: string;
}) {
  if (!total) return null;
  const from = (page - 1) * size + 1;
  const to = Math.min(page * size, total);
  const nums = Array.from(new Set([1, page - 1, page, page + 1, pages])).filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const box = 'grid h-9 min-w-9 place-items-center rounded-button-sm border border-line-subtle px-2 type-label-sm tabular focus-visible:focus-ring';
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle px-5 py-4">
      <p className="type-body-sm text-fg-muted">
        Showing {from} to {to} of {total} {noun}
      </p>
      {pages > 1 && (
        <nav aria-label="Pages">
          <ul className="flex items-center gap-1.5">
            <li>
              {page > 1 ? (
                <Link href={listHref(base, query.params, { page: page - 1 })} className={cn(box, 'hover:bg-hover')} aria-label="Previous page">
                  <ChevronLeft className="size-4" aria-hidden />
                </Link>
              ) : (
                <span className={cn(box, 'opacity-40')} aria-hidden>
                  <ChevronLeft className="size-4" />
                </span>
              )}
            </li>
            {nums.map((n, i) => (
              <li key={n} className="flex items-center gap-1.5">
                {i > 0 && n - nums[i - 1]! > 1 && (
                  <span aria-hidden className="px-1 text-fg-subtle">
                    …
                  </span>
                )}
                <Link
                  href={listHref(base, query.params, { page: n })}
                  aria-current={n === page ? 'page' : undefined}
                  aria-label={`Page ${n}`}
                  className={cn(box, n === page ? 'border-action-primary-border bg-brand-soft text-fg' : 'hover:bg-hover')}
                >
                  {n}
                </Link>
              </li>
            ))}
            <li>
              {page < pages ? (
                <Link href={listHref(base, query.params, { page: page + 1 })} className={cn(box, 'hover:bg-hover')} aria-label="Next page">
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <span className={cn(box, 'opacity-40')} aria-hidden>
                  <ChevronRight className="size-4" />
                </span>
              )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

/** Icon link for a row action (view, edit). */
export function RowLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring [&_svg]:size-4.5"
    >
      {children}
    </Link>
  );
}
