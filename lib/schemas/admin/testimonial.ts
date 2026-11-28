import { z } from 'zod';

import { serviceSlugs } from '@/content/services';
import { mediaRef } from './common';
import { publishStatuses } from '@/lib/admin/types';

/** YouTube video id from a URL or a bare id; null when it is not one. */
export function youtubeId(input: string) {
  const v = input.trim();
  const ok = (id: string | null | undefined) => (id && /^[\w-]{11}$/.test(id) ? id : null);
  if (ok(v)) return v;
  try {
    const u = new URL(v);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    const host = u.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return ok(u.pathname.split('/')[1]);
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      return ok(u.searchParams.get('v')) ?? ok(u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})$/)?.[1]);
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export const testimonialSchema = z
  .object({
    type: z.enum(['text', 'video']),
    clientName: z.string().trim().min(2, 'Add the name.').max(80),
    role: z.string().trim().max(80),
    company: z.string().trim().min(1, 'Add the company.').max(80),
    quote: z.string().trim().min(10, 'Add the quote.').max(400, 'Keep the quote under 400 characters.'),
    avatar: mediaRef.nullable(),
    videoUrl: z.string().trim().max(200),
    poster: mediaRef.nullable(),
    duration: z.string().trim().max(8).refine((v) => !v || /^\d{1,2}:\d{2}$/.test(v), 'Use m:ss, for example 2:14.'),
    caseStudyId: z.string().max(128),
    service: z.union([z.literal(''), z.enum(serviceSlugs)]),
    status: z.enum(publishStatuses),
    isFeatured: z.boolean(),
    consent: z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (d.type === 'video') {
      if (!youtubeId(d.videoUrl)) ctx.addIssue({ code: 'custom', path: ['videoUrl'], message: 'Paste a YouTube link.' });
      if (!d.poster) ctx.addIssue({ code: 'custom', path: ['poster'], message: 'A video needs a poster image.' });
    }
    if (d.poster && !d.poster.alt) ctx.addIssue({ code: 'custom', path: ['poster'], message: 'Add alt text for the poster.' });
    if (d.avatar && !d.avatar.alt) ctx.addIssue({ code: 'custom', path: ['avatar'], message: 'Add alt text for the photo.' });
    if (d.status === 'published' && !d.consent) ctx.addIssue({ code: 'custom', path: ['consent'], message: 'Confirm the client agreed to be quoted.' });
  });

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const emptyTestimonial: TestimonialInput = {
  type: 'text',
  clientName: '',
  role: '',
  company: '',
  quote: '',
  avatar: null,
  videoUrl: '',
  poster: null,
  duration: '',
  caseStudyId: '',
  service: '',
  status: 'draft',
  isFeatured: false,
  consent: false,
};
