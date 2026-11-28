import 'server-only';

import type { DocumentData } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { dhakaStart } from './format';
import { publishStatuses, type PublishStatus } from './types';

/**
 * Local development without Firestore shows demo records so every admin
 * screen can be built and checked. Production without credentials shows empty
 * states instead, never demo data.
 */
export const demoMode = () => !hasFirebaseCredentials() && process.env.NODE_ENV !== 'production';
export const live = () => hasFirebaseCredentials();
export const db = () => getDb();

export const str = (v: unknown) => (typeof v === 'string' ? v : '');
export const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/** Firestore Timestamp, Date or ISO string to ISO; '' when missing. */
export function iso(v: unknown): string {
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate().toISOString();
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? '' : v.toISOString();
  if (typeof v === 'string' && !Number.isNaN(Date.parse(v))) return new Date(v).toISOString();
  if (typeof v === 'number' && Number.isFinite(v)) return new Date(v).toISOString();
  return '';
}

export type Doc = { id: string; data: DocumentData };

/** Count with an aggregate query; 0 on failure so one broken index never blanks the dashboard. */
export async function count(query: FirebaseFirestore.Query): Promise<number> {
  try {
    return (await query.count().get()).data().count;
  } catch (error) {
    console.error('Count query failed', error);
    return 0;
  }
}

/** Day and month starts in Dhaka time (the team's time zone). */
export const startOfToday = () => new Date(dhakaStart('day'));
export const startOfMonth = () => new Date(dhakaStart('month'));

/**
 * Publish status of a post or case study. Legacy docs without one are live;
 * a scheduled item whose time has passed is live too (the site shows it from
 * then on, so the admin says so as well).
 */
export function publishStatusOf(d: DocumentData): PublishStatus {
  const s = str(d.status);
  if (s === 'scheduled') {
    const at = iso(d.publishedAt);
    return at && Date.parse(at) <= Date.now() ? 'published' : 'scheduled';
  }
  return (publishStatuses as readonly string[]).includes(s) ? (s as PublishStatus) : 'published';
}
