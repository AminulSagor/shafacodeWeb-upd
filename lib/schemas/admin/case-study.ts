import { z } from 'zod';

import { serviceSlugs } from '@/content/services';
import { mediaRef, optionalHttps, publishFields, seoField, slugField } from './common';

export const deliveryStatuses = ['delivered', 'in-progress'] as const;

/** Case study editor payload (spec section 8). Drafts may be incomplete; live items may not. */
export const caseStudySchema = z
  .object({
    title: z.string().trim().min(3, 'Add a project title.').max(140),
    client: z.string().trim().min(1, 'Add the client name.').max(80),
    industry: z.string().trim().max(80),
    deliveryStatus: z.enum(deliveryStatuses),
    summary: z.string().trim().max(200, 'Keep the summary under 200 characters.'),
    services: z.array(z.enum(serviceSlugs)).max(7),
    techStack: z.array(z.string().trim().min(1).max(40)).max(20),
    timeline: z.string().trim().max(40),
    liveUrl: optionalHttps,
    contactEmail: z.union([z.literal(''), z.email('Enter a valid email.')]),
    challenge: z.string().max(20_000),
    solution: z.string().max(20_000),
    results: z.array(z.object({ value: z.string().trim().max(12), label: z.string().trim().max(60) })).max(3),
    cover: mediaRef.nullable(),
    gallery: z.array(mediaRef).max(8),
    slug: slugField,
    seo: seoField,
    ...publishFields,
  })
  .superRefine((d, ctx) => {
    const live = d.status === 'published' || d.status === 'scheduled';
    if (live && !d.cover) ctx.addIssue({ code: 'custom', path: ['cover'], message: 'A cover image is required to publish.' });
    if (d.cover && !d.cover.alt) ctx.addIssue({ code: 'custom', path: ['cover'], message: 'Add alt text for the cover.' });
    d.gallery.forEach((g, i) => !g.alt && ctx.addIssue({ code: 'custom', path: ['gallery'], message: `Add alt text for gallery image ${i + 1}.` }));
    if (live && d.summary.length < 20) ctx.addIssue({ code: 'custom', path: ['summary'], message: 'Write a short summary (20 characters or more).' });
    if (live && !d.services.length) ctx.addIssue({ code: 'custom', path: ['services'], message: 'Pick at least one service.' });
    if (d.status === 'scheduled' && !d.publishAt) ctx.addIssue({ code: 'custom', path: ['publishAt'], message: 'Pick when it should go live.' });
    d.results.forEach((r, i) => (!r.value) !== (!r.label) && ctx.addIssue({ code: 'custom', path: ['results'], message: `Metric ${i + 1} needs both a value and a label.` }));
  });

export type CaseStudyInput = z.infer<typeof caseStudySchema>;

/** Portfolio filter categories follow the services. */
export const categoryForService: Record<(typeof serviceSlugs)[number], string> = {
  'custom-software-development': 'backend',
  'web-application-development': 'web-app',
  'mobile-app-development': 'mobile-app',
  'saas-development': 'saas',
  'ui-ux-design': 'ui-ux',
  'wordpress-development': 'web-app',
  'iot-embedded-systems': 'iot',
};

/** A new, empty item for the editor. */
export const emptyCaseStudy: CaseStudyInput = {
  title: '',
  client: '',
  industry: '',
  deliveryStatus: 'delivered',
  summary: '',
  services: [],
  techStack: [],
  timeline: '',
  liveUrl: '',
  contactEmail: '',
  challenge: '',
  solution: '',
  results: [],
  cover: null,
  gallery: [],
  slug: '',
  seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
  status: 'draft',
  isFeatured: false,
  publishAt: '',
};
