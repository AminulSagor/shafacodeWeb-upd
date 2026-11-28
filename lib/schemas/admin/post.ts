import { z } from 'zod';

import { categoryLabels } from '@/content/blog';
import { mediaRef, publishFields, seoField, slugField } from './common';

export const postCategories = Object.keys(categoryLabels) as [string, ...string[]];

export const postSchema = z
  .object({
    title: z.string().trim().min(3, 'Add a title.').max(140),
    excerpt: z.string().trim().max(200, 'Keep the excerpt under 200 characters.'),
    content: z.string().max(100_000),
    category: z.enum(postCategories),
    tags: z.array(z.string().trim().min(1).max(30)).max(10),
    authorId: z.string().max(128),
    cover: mediaRef.nullable(),
    slug: slugField,
    seo: seoField,
    ...publishFields,
  })
  .superRefine((d, ctx) => {
    const live = d.status === 'published' || d.status === 'scheduled';
    if (live && d.excerpt.length < 20) ctx.addIssue({ code: 'custom', path: ['excerpt'], message: 'Write an excerpt (20 characters or more).' });
    if (live && d.content.trim().length < 100) ctx.addIssue({ code: 'custom', path: ['content'], message: 'The post needs content before it goes live.' });
    if (live && !d.authorId) ctx.addIssue({ code: 'custom', path: ['authorId'], message: 'Pick an author.' });
    if (d.cover && !d.cover.alt) ctx.addIssue({ code: 'custom', path: ['cover'], message: 'Add alt text for the cover.' });
    if (d.status === 'scheduled' && !d.publishAt) ctx.addIssue({ code: 'custom', path: ['publishAt'], message: 'Pick when it should go live.' });
  });

export type PostInput = z.infer<typeof postSchema>;

/** A new, empty item for the editor. */
export const emptyPost: PostInput = {
  title: '',
  excerpt: '',
  content: '',
  category: 'startup-mvp',
  tags: [],
  authorId: '',
  cover: null,
  slug: '',
  seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
  status: 'draft',
  isFeatured: false,
  publishAt: '',
};
