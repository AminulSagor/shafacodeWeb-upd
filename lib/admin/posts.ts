import 'server-only';

import { cache } from 'react';
import type { DocumentData } from 'firebase-admin/firestore';

import { fallbackPosts } from '@/content/blog';
import { requireAdmin } from '@/lib/auth';
import { publicMediaUrl } from '@/lib/media';
import { postCategories, type PostInput } from '@/lib/schemas/admin/post';
import { dhakaLocal } from './case-studies';
import { db, demoMode, iso, live, str, strs } from './source';
import { publishStatuses, type PublishStatus } from './types';

export type PostEdit = PostInput & { id: string; authorName: string; createdAt: string; updatedAt: string; publishedAtIso: string };
export type PostRow = Pick<PostEdit, 'id' | 'title' | 'slug' | 'category' | 'status' | 'isFeatured' | 'authorName' | 'updatedAt' | 'publishedAtIso'> & {
  coverUrl: string | null;
};

const status = (d: DocumentData): PublishStatus => {
  const s = str(d.status);
  return (publishStatuses as readonly string[]).includes(s) ? (s as PublishStatus) : 'published';
};

function toEdit(id: string, d: DocumentData): PostEdit {
  const coverPath = str(d.cover?.path) || str(d.coverImage);
  const publishedAtIso = iso(d.publishedAt) || (status(d) === 'published' ? iso(d.createdAt) : '');
  const category = str(d.category);
  return {
    id,
    title: str(d.title),
    excerpt: str(d.excerpt),
    content: str(d.content),
    category: postCategories.includes(category) ? category : 'tech',
    tags: strs(d.tags),
    authorId: str(d.authorId),
    authorName: str(d.author?.name),
    cover: coverPath ? { path: coverPath, alt: str(d.cover?.alt) || str(d.title), width: Number(d.cover?.width) || 1200, height: Number(d.cover?.height) || 630 } : null,
    slug: str(d.slug),
    seo: { metaTitle: str(d.seo?.metaTitle), metaDescription: str(d.seo?.metaDescription), canonicalUrl: str(d.seo?.canonicalUrl), noIndex: d.seo?.noIndex === true },
    status: status(d),
    isFeatured: d.isFeatured === true,
    publishAt: dhakaLocal(publishedAtIso),
    publishedAtIso,
    createdAt: iso(d.createdAt),
    updatedAt: iso(d.updatedAt) || iso(d.createdAt),
  };
}

const readAll = cache(async (): Promise<PostEdit[]> => {
  await requireAdmin();
  if (demoMode()) {
    const statuses: PublishStatus[] = ['published', 'draft', 'published', 'scheduled', 'published', 'published'];
    return fallbackPosts.map((p, i) => ({
      id: `d-post-${i + 1}`,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: postCategories.includes(p.category) ? p.category : 'tech',
      tags: [],
      authorId: 'd-team-1',
      authorName: p.author.name,
      cover: p.cover ? { path: p.cover.src, alt: p.cover.alt, width: 1200, height: 630 } : null,
      slug: p.slug,
      seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
      status: statuses[i % statuses.length]!,
      isFeatured: !!p.featured,
      publishAt: dhakaLocal(p.publishedAt),
      publishedAtIso: p.publishedAt,
      createdAt: p.publishedAt,
      updatedAt: p.updatedAt,
    }));
  }
  if (!live()) return [];
  const snap = await db().collection('blogs').get();
  return snap.docs.map((d) => toEdit(d.id, d.data()));
});

export async function listPostsAdmin(): Promise<PostRow[]> {
  return (await readAll())
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      status: p.status,
      isFeatured: p.isFeatured,
      authorName: p.authorName,
      updatedAt: p.updatedAt,
      publishedAtIso: p.publishedAtIso,
      coverUrl: p.cover ? (p.cover.path.startsWith('/') || /^https?:/.test(p.cover.path) ? p.cover.path : publicMediaUrl(p.cover.path)) : null,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPostForEdit(id: string) {
  return (await readAll()).find((p) => p.id === id) ?? null;
}
