/** First value of a search param (Next passes repeated keys as an array). */
export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

/** Positive integer from a search param, or the fallback. */
export function positiveInt(v: string | string[] | undefined, fallback: number, max = 10_000) {
  const n = Math.trunc(Number(first(v)));
  return Number.isFinite(n) && n >= 1 ? Math.min(n, max) : fallback;
}

export type RawSearchParams = Record<string, string | string[] | undefined>;
