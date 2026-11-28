import 'server-only';

import { unstable_cache } from 'next/cache';
import type { DocumentData } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { defaultAuthor, fallbackPosts, type Post } from '@/content/blog';
import { publicMediaUrl } from '@/lib/media';
import { wordCount } from '@/lib/markdown';

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** Firestore Timestamp, ISO string or nothing, as an ISO string. */
function toIso(v: unknown): string {
  if (v && typeof v === 'object' && 'toDate' in v && typeof (v as { toDate: () => Date }).toDate === 'function') {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString();
  if ((typeof v === 'string' || typeof v === 'number') && !Number.isNaN(new Date(v).getTime())) return new Date(v).toISOString();
  return new Date(0).toISOString();
}

export const readingMinutes = (markdown: string) => Math.max(1, Math.round(wordCount(markdown) / 220));

/**
 * Firestore document to a public DTO. Supports the 2026 schema (status,
 * publishedAt, cover path) and the current one (coverImage URL, ISO dates).
 */
function toPost(d: DocumentData): Post | null {
  const status = str(d.status) || 'published';
  const due = status === 'scheduled' && !!d.publishedAt && new Date(toIso(d.publishedAt)).getTime() <= Date.now();
  if (status !== 'published' && !due) return null;
  const title = str(d.title);
  const slug = str(d.slug);
  if (!title || !slug) return null;
  const content = str(d.content);
  const coverSrc = d.cover?.path ? publicMediaUrl(str(d.cover.path)) : str(d.coverImage);
  const publishedAt = toIso(d.publishedAt ?? d.createdAt);
  return {
    slug,
    title,
    excerpt: str(d.excerpt),
    content,
    category: str(d.category) || 'tech',
    cover: coverSrc ? { src: coverSrc, alt: str(d.cover?.alt) || title } : null,
    author: d.author?.name
      ? {
          name: str(d.author.name),
          role: str(d.author.role),
          bio: str(d.author.bio),
          photo: d.author.photo ? (str(d.author.photo).startsWith('/') ? str(d.author.photo) : publicMediaUrl(str(d.author.photo))) : null,
        }
      : defaultAuthor,
    publishedAt,
    updatedAt: toIso(d.updatedAt ?? d.publishedAt ?? d.createdAt),
    readingMinutes: Math.max(1, Math.round(Number(d.readingMinutes)) || readingMinutes(content)),
    featured: d.isFeatured === true,
    seo:
      d.seo && typeof d.seo === 'object'
        ? { metaTitle: str(d.seo.metaTitle) || undefined, metaDescription: str(d.seo.metaDescription) || undefined, canonicalUrl: str(d.seo.canonicalUrl) || undefined, noIndex: d.seo.noIndex === true }
        : undefined,
    previousSlugs: Array.isArray(d.previousSlugs) ? d.previousSlugs.filter((x: unknown): x is string => typeof x === 'string') : [],
  };
}

const readAll = unstable_cache(
  async (): Promise<Post[]> => {
    // Errors propagate so a failed read is not cached.
    const snap = await getDb().collection('blogs').get();
    return snap.docs
      .map((doc) => toPost(doc.data()))
      .filter((p): p is Post => p !== null)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  ['posts:all'],
  { tags: ['blogs'], revalidate: 3600 }
);

/** Published posts, newest first. Seed posts only when the CMS cannot be read. */
export async function getPosts(): Promise<Post[]> {
  if (!hasFirebaseCredentials()) return fallbackPosts;
  try {
    return await readAll();
  } catch (error) {
    console.error('Failed to read posts', error);
    return [];
  }
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

/** The current slug for an old one (renamed published posts), if any. */
export async function resolvePreviousPostSlug(slug: string): Promise<string | null> {
  return (await getPosts()).find((p) => p.previousSlugs?.includes(slug))?.slug ?? null;
}

export async function getRelatedPosts(post: Post, limit = 3) {
  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  return [...same, ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}
