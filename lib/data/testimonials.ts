import 'server-only';

import { unstable_cache } from 'next/cache';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { textTestimonials, videoStories, type TextTestimonial, type VideoStory } from '@/content/testimonials';
import { publicMediaUrl } from '@/lib/media';
import { youtubeId } from '@/lib/schemas/admin/testimonial';

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const src = (path: string) => (path.startsWith('/') ? path : publicMediaUrl(path));

const readAll = unstable_cache(
  async () => {
    const snap = await getDb().collection('testimonials').where('status', '==', 'published').get();
    const docs = snap.docs.map((d) => d.data()).sort((a, b) => Number(b.isFeatured === true) - Number(a.isFeatured === true));
    const text: TextTestimonial[] = docs
      .filter((d) => d.type !== 'video')
      .map((d) => ({
        quote: str(d.quote),
        name: str(d.clientName),
        role: [str(d.role), str(d.company)].filter(Boolean).join(', '),
        photo: d.avatar?.path ? src(str(d.avatar.path)) : '',
      }));
    const video: VideoStory[] = docs
      .filter((d) => d.type === 'video' && d.poster?.path)
      .map((d) => ({
        quote: str(d.quote),
        name: str(d.clientName),
        role: [str(d.role), str(d.company)].filter(Boolean).join(', '),
        poster: { src: src(str(d.poster.path)), alt: str(d.poster.alt) },
        duration: str(d.duration),
        youtubeId: youtubeId(str(d.videoUrl)) ?? undefined,
      }));
    return { text, video };
  },
  ['testimonials:published'],
  { tags: ['testimonials'], revalidate: 3600 }
);

/** Published testimonials for Home; the design seed fills a list that is still empty. */
export async function getTestimonials(): Promise<{ text: TextTestimonial[]; video: VideoStory[] }> {
  if (!hasFirebaseCredentials()) return { text: textTestimonials, video: videoStories };
  try {
    const { text, video } = await readAll();
    return { text: text.length ? text : textTestimonials, video: video.length ? video : videoStories };
  } catch (error) {
    console.error('Failed to read testimonials', error);
    return { text: textTestimonials, video: videoStories };
  }
}
