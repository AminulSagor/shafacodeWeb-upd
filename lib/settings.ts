import 'server-only';

import { unstable_cache } from 'next/cache';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { defaultSettings, settingsSchema, type SiteSettings } from '@/lib/schemas/admin/settings';

/** Defaults, with the notification recipient from TO_EMAIL as before the admin existed. */
const defaults = (): SiteSettings => ({
  ...defaultSettings,
  notifications: { ...defaultSettings.notifications, recipient: process.env.TO_EMAIL || defaultSettings.email },
});

const read = unstable_cache(
  async (): Promise<SiteSettings> => {
    const snap = await getDb().collection('settings').doc('site').get();
    const base = defaults();
    const merged = { ...base, ...(snap.data() ?? {}), notifications: { ...base.notifications, ...(snap.get('notifications') ?? {}) } };
    const parsed = settingsSchema.safeParse(merged);
    if (parsed.success) return parsed.data;
    console.error('Saved settings do not match the schema; using defaults', parsed.error.issues.slice(0, 3));
    // Never let a schema mismatch switch indexing back on.
    return { ...base, allowIndexing: snap.get('allowIndexing') !== false };
  },
  ['settings:site'],
  { tags: ['settings'], revalidate: 3600 }
);

/** Site settings with defaults from content/site; server only (holds the notification recipient). */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasFirebaseCredentials()) return defaults();
  try {
    return await read();
  } catch (error) {
    console.error('Failed to read settings', error);
    return defaults();
  }
}
