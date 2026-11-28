import { first, positiveInt, type RawSearchParams } from '@/lib/search-params';

export const PAGE_SIZE = 10;

export type ListQuery = {
  q?: string;
  page: number;
  sort?: string;
  dir: 'asc' | 'desc';
  params: RawSearchParams;
  get: (key: string) => string | undefined;
};

/** Reads the shared list params (q, page, sort, dir) plus any filter key. */
export function readListQuery(params: RawSearchParams): ListQuery {
  return {
    q: first(params.q)?.slice(0, 100),
    page: positiveInt(params.page, 1),
    sort: first(params.sort),
    dir: first(params.dir) === 'asc' ? 'asc' : 'desc',
    params,
    get: (key) => first(params[key]),
  };
}

/** Case-insensitive match of the query against the given fields. */
export function matches(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(needle));
}

export function sortBy<T>(rows: T[], key: ((row: T) => string | number) | undefined, dir: 'asc' | 'desc') {
  if (!key) return rows;
  const sign = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = key(a);
    const y = key(b);
    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * sign;
  });
}

export function paginate<T>(rows: T[], page: number, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pages);
  return { rows: rows.slice((current - 1) * size, current * size), page: current, pages, total: rows.length, size };
}

/** URL for the same list with some params changed (undefined removes one). Page resets unless set. */
export function listHref(base: string, params: RawSearchParams, change: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const val = first(v);
    if (val && k !== 'id') sp.set(k, val);
  }
  if (!('page' in change)) sp.delete('page');
  for (const [k, v] of Object.entries(change)) {
    if (v === undefined || v === '' || (k === 'page' && v === 1)) sp.delete(k);
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}
