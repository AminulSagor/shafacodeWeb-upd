import 'server-only';

import { unstable_cache } from 'next/cache';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { fallbackTeam, type TeamMember } from '@/content/about';
import { publicMediaUrl } from '@/lib/media';

const str = (v: unknown) => (typeof v === 'string' ? v : '');

const readTeam = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const snap = await getDb().collection('team').where('visible', '==', true).get();
    return snap.docs
      .map((d) => d.data())
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
      .map((d) => ({
        name: str(d.name),
        role: str(d.role),
        bio: str(d.bio),
        photo: d.photo?.path ? publicMediaUrl(str(d.photo.path)) : null,
        linkedinUrl: str(d.linkedinUrl) || undefined,
      }))
      .filter((m) => m.name);
  },
  ['team:visible'],
  { tags: ['team'], revalidate: 3600 }
);

/** Visible team members in display order; the design seed when there are none. */
export async function getTeam(): Promise<TeamMember[]> {
  if (!hasFirebaseCredentials()) return fallbackTeam;
  try {
    const team = await readTeam();
    return team.length ? team : fallbackTeam;
  } catch (error) {
    console.error('Failed to read team', error);
    return fallbackTeam;
  }
}
