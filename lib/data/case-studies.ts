import 'server-only';

import { unstable_cache } from 'next/cache';
import type { DocumentData } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { fallbackCaseStudies, portfolioCategories, type CaseStudy, type CaseStudySummary } from '@/content/case-studies';
import { serviceSlugs, type ServiceSlug } from '@/content/services';
import { toMillis } from '@/lib/dates';
import { publicMediaUrl } from '@/lib/media';

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);

/**
 * Firestore document to a public DTO. Explicit fields only: `contactEmail`
 * and other private fields never reach a Server Component payload.
 * Supports both the 2026 schema and the legacy one (title, description,
 * client, status) until the migration script runs.
 */
function toCaseStudy(id: string, d: DocumentData): CaseStudy | null {
  // Allowlist: the 2026 'published' (and 'scheduled' once its time has come)
  // plus the legacy delivery statuses.
  const status = str(d.status) || 'published';
  const due = status === 'scheduled' && toMillis(d.publishedAt) > 0 && toMillis(d.publishedAt) <= Date.now();
  if (!due && !['published', 'delivered', 'in-progress', 'ongoing'].includes(status)) return null;
  const title = str(d.title);
  if (!title) return null;
  const legacy = !d.slug;
  const cover = d.cover?.path
    ? {
        src: publicMediaUrl(str(d.cover.path)),
        alt: str(d.cover.alt),
        width: Number(d.cover.width) || 1264,
        height: Number(d.cover.height) || 848,
      }
    : null;
  const description = str(d.description) || str(d.summary);
  return {
    slug: legacy ? `${slugify(title)}-${id.slice(0, 6).toLowerCase()}` : str(d.slug),
    client: str(d.client),
    title,
    summary: str(d.summary) || (description.length > 180 ? `${description.slice(0, 177).trimEnd()}…` : description),
    tags: [str(d.industry), ...strArr(d.tags)].filter(Boolean),
    services: strArr(d.services).filter((s): s is ServiceSlug => (serviceSlugs as readonly string[]).includes(s)),
    categories: strArr(d.categories).filter((c): c is CaseStudy['categories'][number] =>
      portfolioCategories.some((p) => p.id === c)
    ),
    delivery: ['in-progress', 'ongoing'].includes(str(d.deliveryStatus || d.status)) ? 'ongoing' : 'delivered',
    cover,
    results: Array.isArray(d.results)
      ? d.results
          .filter((r: unknown): r is { value?: unknown; label?: unknown } => !!r && typeof r === 'object')
          .slice(0, 3)
          .map((r: { value?: unknown; label?: unknown }) => ({ value: str(r.value), label: str(r.label) }))
      : [],
    lede: str(d.summary) || undefined,
    industry: str(d.industry) || undefined,
    timeline: str(d.timeline) || undefined,
    stack: strArr(d.techStack),
    challenge: str(d.challenge) || undefined,
    solution: str(d.solution) || undefined,
    body: legacy ? description : undefined,
    gallery: Array.isArray(d.gallery)
      ? d.gallery
          .filter((g: unknown): g is Record<string, unknown> => !!g && typeof g === 'object' && !!str((g as Record<string, unknown>).path))
          .map((g: Record<string, unknown>) => ({
            src: publicMediaUrl(str(g.path)),
            alt: str(g.alt),
            width: Number(g.width) || 1264,
            height: Number(g.height) || 848,
          }))
      : undefined,
    liveUrl: str(d.liveUrl) || undefined,
    seo: d.seo && typeof d.seo === 'object'
      ? { metaTitle: str(d.seo.metaTitle) || undefined, metaDescription: str(d.seo.metaDescription) || undefined, canonicalUrl: str(d.seo.canonicalUrl) || undefined, noIndex: d.seo.noIndex === true }
      : undefined,
    previousSlugs: strArr(d.previousSlugs),
    featured: d.isFeatured === true,
  };
}

const readAll = unstable_cache(
  async (): Promise<CaseStudy[]> => {
    // Errors propagate so unstable_cache does not store a failed read.
    const snap = await getDb().collection('projects').get();
    const time = (d: DocumentData) => toMillis(d.publishedAt) || toMillis(d.createdAt);
    return snap.docs
      .sort((a, b) => Number(b.data().isFeatured === true) - Number(a.data().isFeatured === true) || time(b.data()) - time(a.data()))
      .map((doc) => toCaseStudy(doc.id, doc.data()))
      .filter((x): x is CaseStudy => x !== null);
  },
  ['case-studies:all'],
  { tags: ['projects'], revalidate: 3600 }
);

/** Every public case study: CMS entries when there are any, else the design seed. */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!hasFirebaseCredentials()) return fallbackCaseStudies;
  try {
    const items = await readAll();
    return items.length > 0 ? items : fallbackCaseStudies;
  } catch (error) {
    console.error('Failed to read case studies', error);
    return fallbackCaseStudies;
  }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const all = await getCaseStudies();
  return all.find((c) => c.slug === slug) ?? null;
}

/** The current slug for an old one (renamed published case studies), if any. */
export async function resolvePreviousCaseStudySlug(slug: string): Promise<string | null> {
  const all = await getCaseStudies();
  return all.find((c) => c.previousSlugs?.includes(slug))?.slug ?? null;
}

/** Featured on Home: CMS items with a cover first, the design seed otherwise. */
export async function getFeaturedCaseStudies(): Promise<CaseStudySummary[]> {
  const all = await getCaseStudies();
  const withCover = all.filter((c) => c.cover);
  // Items marked featured in the admin come first.
  const ordered = [...withCover.filter((c) => c.featured), ...withCover.filter((c) => !c.featured)];
  return (ordered.length >= 3 ? ordered : fallbackCaseStudies).slice(0, 3);
}

/** Up to `limit` case studies for a service page, the closest matches first. */
export async function getCaseStudiesForService(slug: string, limit = 2): Promise<CaseStudySummary[]> {
  const pool = (await getCaseStudies()).filter((c) => c.cover);
  const matching = pool.filter((c) => c.services.some((s) => s === slug));
  const rest = pool.filter((c) => !matching.includes(c));
  return [...matching, ...rest].slice(0, limit);
}

export async function getRelatedCaseStudies(current: CaseStudy, limit = 2): Promise<CaseStudySummary[]> {
  const pool = (await getCaseStudies()).filter((c) => c.slug !== current.slug && c.cover);
  const score = (c: CaseStudySummary) => c.services.filter((s) => current.services.includes(s)).length;
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, limit);
}
