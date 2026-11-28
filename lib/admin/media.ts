import 'server-only';

import { cache } from 'react';

import { requireAdmin } from '@/lib/auth';
import { publicMediaUrl } from '@/lib/media';
import { db, demoMode, iso, live, str, strs } from './source';

export type MediaItem = {
  id: string;
  path: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  type: string;
  usedIn: string[];
  createdAt: string;
};

const demo: MediaItem[] = [
  ['meghswar-courier.jpg', 'Courier rider checking a delivery route on a phone', ['case-study:meghswar-courier']],
  ['chorki.jpg', 'Streaming dashboard on a laptop in a living room', ['case-study:chorki']],
  ['texas-airway-institute.jpg', 'Two students reviewing a course dashboard in a library', ['case-study:texas-airway-institute']],
  ['tri-gardening.jpg', '', []],
].map(([file, alt, used], i) => ({
  id: `d-media-${i + 1}`,
  path: `/images/work/${file}`,
  url: `/images/work/${file}`,
  alt: alt as string,
  width: 1264,
  height: 848,
  size: 180_000 + i * 20_000,
  type: 'image/jpeg',
  usedIn: used as string[],
  createdAt: new Date(Date.now() - i * 86_400_000 * 3).toISOString(),
}));

/** Every media item, newest first. */
export const listMedia = cache(async (): Promise<MediaItem[]> => {
  await requireAdmin();
  if (demoMode()) return demo;
  if (!live()) return [];
  const snap = await db().collection('media').get();
  return snap.docs
    .map((d) => {
      const x = d.data();
      const path = str(x.path) || str(x.url) || str(x.imageUrl);
      return {
        id: d.id,
        path,
        url: path ? publicMediaUrl(path) : '',
        alt: str(x.alt),
        width: Number(x.width) || 0,
        height: Number(x.height) || 0,
        size: Number(x.size) || 0,
        type: str(x.type),
        usedIn: strs(x.usedIn),
        createdAt: iso(x.createdAt),
      };
    })
    .filter((m) => m.path)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});
