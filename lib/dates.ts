/** Firestore Timestamp, Date, epoch ms or ISO string to ISO; '' when missing or invalid. */
export function toIso(v: unknown): string {
  if (v && typeof v === 'object' && 'toDate' in v && typeof (v as { toDate: unknown }).toDate === 'function') {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? '' : v.toISOString();
  if (typeof v === 'number' && Number.isFinite(v)) return new Date(v).toISOString();
  if (typeof v === 'string' && v && !Number.isNaN(Date.parse(v))) return new Date(v).toISOString();
  return '';
}

/** Milliseconds for sorting; 0 when missing. */
export const toMillis = (v: unknown) => {
  const iso = toIso(v);
  return iso ? Date.parse(iso) : 0;
};

/** Formats an ISO date, or '' for a missing or invalid one (never "Invalid Date"). */
export function formatIso(fmt: Intl.DateTimeFormat, iso: string | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : fmt.format(d);
}
