import 'server-only';

import { cache } from 'react';

import { textTestimonials, videoStories } from '@/content/testimonials';
import { serviceSlugs } from '@/content/services';
import { requireAdmin } from '@/lib/auth';
import { publicMediaUrl } from '@/lib/media';
import type { TestimonialInput } from '@/lib/schemas/admin/testimonial';
import { db, demoMode, iso, live, str } from './source';
import { publishStatuses, type PublishStatus } from './types';

export type TestimonialEdit = TestimonialInput & { id: string; avatarUrl: string | null; updatedAt: string };

const ref = (v: Record<string, unknown> | undefined) =>
  v && str(v.path) ? { path: str(v.path), alt: str(v.alt), width: Number(v.width) || 0, height: Number(v.height) || 0 } : null;
const url = (p?: string) => (!p ? null : p.startsWith('/') ? p : publicMediaUrl(p));

const readAll = cache(async (): Promise<TestimonialEdit[]> => {
  await requireAdmin();
  if (demoMode()) {
    const split = (role: string) => {
      const [r, c] = role.split(', ');
      return { role: r ?? '', company: c ?? '' };
    };
    return [
      ...textTestimonials.map((t, i) => ({
        id: `d-tm-${i + 1}`,
        type: 'text' as const,
        clientName: t.name,
        ...split(t.role),
        quote: t.quote,
        avatar: { path: t.photo, alt: `Portrait of ${t.name}`, width: 88, height: 88 },
        avatarUrl: t.photo,
        videoUrl: '',
        poster: null,
        duration: '',
        caseStudyId: '',
        service: '' as const,
        status: (i === 2 ? 'draft' : 'published') as PublishStatus,
        isFeatured: i === 0,
        consent: true,
        updatedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
      })),
      ...videoStories.map((v, i) => ({
        id: `d-tv-${i + 1}`,
        type: 'video' as const,
        clientName: v.name,
        ...split(v.role),
        quote: v.quote,
        avatar: null,
        avatarUrl: v.poster.src,
        videoUrl: 'https://youtu.be/ZliPBGFF7rY',
        poster: { path: v.poster.src, alt: v.poster.alt, width: 1200, height: 800 },
        duration: v.duration,
        caseStudyId: '',
        service: '' as const,
        status: 'published' as PublishStatus,
        isFeatured: false,
        consent: true,
        updatedAt: new Date(Date.now() - (i + 3) * 86_400_000).toISOString(),
      })),
    ];
  }
  if (!live()) return [];
  const snap = await db().collection('testimonials').get();
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      const s = str(d.status);
      const service = str(d.service);
      const avatar = ref(d.avatar);
      const poster = ref(d.poster);
      return {
        id: doc.id,
        type: d.type === 'video' ? ('video' as const) : ('text' as const),
        clientName: str(d.clientName),
        role: str(d.role),
        company: str(d.company),
        quote: str(d.quote),
        avatar,
        avatarUrl: url(avatar?.path ?? poster?.path),
        videoUrl: str(d.videoUrl),
        poster,
        duration: str(d.duration),
        caseStudyId: str(d.caseStudyId),
        service: (serviceSlugs as readonly string[]).includes(service) ? (service as TestimonialInput['service']) : '',
        status: (publishStatuses as readonly string[]).includes(s) ? (s as PublishStatus) : 'draft',
        isFeatured: d.isFeatured === true,
        consent: d.consent === true,
        updatedAt: iso(d.updatedAt) || iso(d.createdAt),
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
});

export const listTestimonialsAdmin = readAll;
export async function getTestimonialForEdit(id: string) {
  return (await readAll()).find((t) => t.id === id) ?? null;
}
