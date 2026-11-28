import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { listHref, type ListQuery } from '@/lib/admin/list';

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Makes the header a sort link for this key. */
  sortable?: boolean;
  className?: string;
  /** Hidden from the stacked mobile card (shown elsewhere in it). */
  hideOnCard?: boolean;
  /** The row's main cell: first on cards, sticky on mid widths. */
  primary?: boolean;
};

/**
 * Admin data table, rendered on the server. Sorting, search, filters and
 * pages live in the URL. 768 to 1279px: horizontal scroll with the first
 * and actions columns sticky. Below 768px each row stacks as a card.
 */
export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  base,
  query,
  actions,
  caption,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  base: string;
  query: ListQuery;
  actions?: (row: T) => React.ReactNode;
  caption: string;
  empty: React.ReactNode;
}) {
  if (!rows.length) return <div className="px-5 py-14 text-center">{empty}</div>;
  return (
    <div className="md:overflow-x-auto">
      <table className="w-full border-collapse type-body-sm md:min-w-240 xl:min-w-0">
        <caption className="sr-only">{caption}</caption>
        <thead className="max-md:sr-only">
          <tr className="border-b border-line-subtle bg-surface-2">
            {columns.map((c) => {
              const active = query.sort === c.key;
              const nextDir = active && query.dir === 'desc' ? 'asc' : 'desc';
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (query.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={cn(
                    'px-4 py-3 text-left type-mono-xs font-medium whitespace-nowrap text-fg-subtle',
                    c.primary && 'md:sticky md:left-0 md:z-1 md:bg-surface-2 xl:static',
                    c.className
                  )}
                >
                  {c.sortable ? (
                    <Link
                      href={listHref(base, query.params, { sort: c.key, dir: nextDir })}
                      scroll={false}
                      className="inline-flex items-center gap-1.5 rounded-sm hover:text-fg focus-visible:focus-ring"
                    >
                      {c.header}
                      {active ? (
                        query.dir === 'asc' ? (
                          <ArrowUp className="size-3.5" aria-hidden />
                        ) : (
                          <ArrowDown className="size-3.5" aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" aria-hidden />
                      )}
                    </Link>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
            {actions && (
              <th scope="col" className="px-4 py-3 md:sticky md:right-0 md:bg-surface-2 xl:static">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="max-md:flex max-md:flex-col max-md:gap-3 max-md:p-4">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="group relative border-line-subtle hover:bg-hover max-md:flex max-md:flex-col max-md:gap-2 max-md:rounded-md max-md:border max-md:p-4 md:border-b md:last:border-0"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  data-label={c.header}
                  className={cn(
                    'px-4 py-3.5 align-middle max-md:p-0',
                    c.primary
                      ? 'md:sticky md:left-0 md:z-1 md:bg-surface-1 md:group-hover:bg-surface-2 xl:static xl:bg-transparent xl:group-hover:bg-transparent'
                      : 'max-md:flex max-md:items-center max-md:justify-between max-md:gap-4 max-md:before:type-mono-xs max-md:before:text-fg-subtle max-md:before:content-[attr(data-label)]',
                    c.hideOnCard && 'max-md:hidden',
                    c.className
                  )}
                >
                  {c.cell(row)}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3.5 text-right max-md:border-t max-md:border-line-subtle max-md:p-0 max-md:pt-2 md:sticky md:right-0 md:bg-surface-1 md:group-hover:bg-surface-2 xl:static xl:bg-transparent xl:group-hover:bg-transparent">
                  <div className="relative z-2 flex items-center justify-end gap-1">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
