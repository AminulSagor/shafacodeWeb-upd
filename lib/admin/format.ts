import { budgetOptions, projectTypeOptions, timelineOptions } from '@/lib/schemas/inquiry';

const tz = 'Asia/Dhaka';
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: tz });
const dateYearFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: tz });
const dateTimeFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: tz });
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
const longFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: tz });

export const formatDate = (isoDate: string) => (isoDate ? dateFmt.format(new Date(isoDate)) : '');
export const formatDateYear = (isoDate: string) => (isoDate ? dateYearFmt.format(new Date(isoDate)) : '');
export const formatDateTime = (isoDate: string) => (isoDate ? dateTimeFmt.format(new Date(isoDate)) : '');
export const formatLongDate = (d: Date) => longFmt.format(d);

const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
/** Calendar date in Dhaka, YYYY-MM-DD. */
export const dhakaDay = (d: Date | number = Date.now()) => dayKey.format(d);

/**
 * Start of the current day, week (Monday), month or quarter in Dhaka time,
 * as ISO. `offset` moves by whole units (months for month, and so on).
 */
export function dhakaStart(unit: 'day' | 'week' | 'month' | 'quarter', offset = 0, now = new Date()) {
  const [y, m, d] = dhakaDay(now).split('-').map(Number) as [number, number, number];
  let date: Date;
  if (unit === 'day') date = new Date(Date.UTC(y, m - 1, d + offset));
  else if (unit === 'week') {
    const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
    date = new Date(Date.UTC(y, m - 1, d - weekday + offset * 7));
  } else if (unit === 'month') date = new Date(Date.UTC(y, m - 1 + offset, 1));
  else date = new Date(Date.UTC(y, Math.floor((m - 1) / 3) * 3 + offset * 3, 1));
  // Midnight in Dhaka is 18:00 UTC of the previous day.
  return new Date(date.getTime() - 6 * 3_600_000).toISOString();
}

/** "2h ago", "Yesterday", "Mon", then a date. Times and calendar days in Dhaka. */
export function relativeTime(isoDate: string, now = Date.now()) {
  if (!isoDate) return '';
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return '';
  const diff = now - t;
  const h = diff / 3600_000;
  if (diff < 0) {
    const day = dhakaDay(t);
    if (day === dhakaDay(now)) return `Today ${timeFmt.format(t)}`;
    if (day === dhakaDay(now + 86_400_000)) return `Tomorrow ${timeFmt.format(t)}`;
    return dateTimeFmt.format(t);
  }
  if (h < 1) return `${Math.max(1, Math.round(diff / 60_000))}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  if (h < 48) return 'Yesterday';
  if (h < 24 * 6) return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(t);
  return dateFmt.format(t);
}

const shortType: Record<string, string> = {
  website: 'Website',
  'web-app': 'Web app',
  'mobile-app': 'Mobile app',
  saas: 'SaaS',
  'custom-software': 'Custom',
  'ui-ux': 'UI/UX',
  wordpress: 'WordPress',
  iot: 'IoT',
  other: 'Other',
};
const shortBudget: Record<string, string> = {
  'under-100k': '< ৳100k',
  '100k-300k': '৳100k – 300k',
  '300k-700k': '৳300k – 700k',
  '700k+': '৳700k+',
  'not-sure': 'Not sure',
};

export const projectTypeShort = (v: string) => shortType[v] ?? v;
export const projectTypeLabel = (v: string) => projectTypeOptions.find((o) => o.value === v)?.label ?? v;
export const budgetShort = (v: string) => (v ? (shortBudget[v] ?? v) : 'Not set');
export const budgetLabel = (v: string) => budgetOptions.find((o) => o.value === v)?.label ?? v;
export const timelineLabel = (v: string) => timelineOptions.find((o) => o.value === v)?.label ?? v;

/** Up to two initials for avatar tiles. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('') || 'A';

/** True when the date is within the last 24 hours. */
export const isRecent = (isoDate: string, hours = 24) => !!isoDate && Date.now() - Date.parse(isoDate) < hours * 3_600_000;
