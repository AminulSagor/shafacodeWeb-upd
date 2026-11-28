import 'server-only';

import { unstable_cache } from 'next/cache';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { defaultSettings, settingsSchema, type SiteSettings } from '@/lib/schemas/admin/settings';

const read = unstable_cache(
  async (): Promise<SiteSettings> => {
    const snap = await getDb().collection('settings').doc('site').get();
    const merged = { ...defaultSettings, ...(snap.data() ?? {}), notifications: { ...defaultSettings.notifications, ...(snap.get('notifications') ?? {}) } };
    const parsed = settingsSchema.safeParse(merged);
    return parsed.success ? parsed.data : defaultSettings;
  },
  ['settings:site'],
  { tags: ['settings'], revalidate: 3600 }
);

/** Site settings with defaults from content/site; server only (holds the notification recipient). */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasFirebaseCredentials()) return defaultSettings;
  try {
    return await read();
  } catch (error) {
    console.error('Failed to read settings', error);
    return defaultSettings;
  }
}
