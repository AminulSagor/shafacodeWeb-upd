import 'server-only';

import { cache } from 'react';

import { fallbackTeam } from '@/content/about';
import { requireAdmin } from '@/lib/auth';
import { publicMediaUrl } from '@/lib/media';
import type { TeamInput } from '@/lib/schemas/admin/team';
import { db, demoMode, iso, live, str } from './source';

export type TeamEdit = TeamInput & { id: string; order: number; photoUrl: string | null; updatedAt: string };

const listAll = cache(async (): Promise<TeamEdit[]> => {
  await requireAdmin();
  if (demoMode()) {
    return fallbackTeam.map((m, i) => ({
      id: `d-team-${i + 1}`,
      name: m.name,
      role: m.role,
      department: i === 0 ? 'Leadership' : i === 1 ? 'Design' : 'Engineering',
      location: 'Barishal, Bangladesh',
      bio: m.bio,
      photo: m.photo ? { path: m.photo, alt: `Portrait of ${m.name}`, width: 600, height: 620 } : null,
      photoUrl: m.photo,
      linkedinUrl: m.linkedinUrl ?? '',
      portfolioUrl: '',
      visible: true,
      isAuthor: i < 3,
      order: i,
      updatedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
    }));
  }
  if (!live()) return [];
  const snap = await db().collection('team').get();
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      const path = str(d.photo?.path);
      return {
        id: doc.id,
        name: str(d.name),
        role: str(d.role),
        department: str(d.department),
        location: str(d.location),
        bio: str(d.bio),
        photo: path ? { path, alt: str(d.photo?.alt), width: Number(d.photo?.width) || 0, height: Number(d.photo?.height) || 0 } : null,
        photoUrl: path ? publicMediaUrl(path) : null,
        linkedinUrl: str(d.linkedinUrl),
        portfolioUrl: str(d.portfolioUrl),
        visible: d.visible !== false,
        isAuthor: d.isAuthor === true,
        order: Number(d.order) || 0,
        updatedAt: iso(d.updatedAt) || iso(d.createdAt),
      };
    })
    .sort((a, b) => a.order - b.order);
});

export const listTeamAdmin = listAll;
export async function getTeamMemberForEdit(id: string) {
  return (await listAll()).find((m) => m.id === id) ?? null;
}
/** Team members who can be credited as blog authors. */
export async function listAuthors() {
  return (await listAll()).filter((m) => m.isAuthor).map((m) => ({ id: m.id, name: m.name, role: m.role, bio: m.bio, photo: m.photo?.path ?? null }));
}
