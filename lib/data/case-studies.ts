import 'server-only';

import { unstable_cache } from 'next/cache';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { fallbackCaseStudies, type CaseStudySummary } from '@/content/case-studies';
import { publicMediaUrl } from '@/lib/media';

/**
 * Published case studies as DTOs (explicit fields only: `contactEmail` and
 * other private fields never reach a Server Component payload). Until the
 * migration fills the new fields, the seed content from the design is used.
 */
const readFeatured = unstable_cache(
  async (): Promise<CaseStudySummary[]> => {
    if (!hasFirebaseCredentials()) return [];
    try {
      const snap = await getDb()
        .collection('projects')
        .where('status', '==', 'published')
        .where('isFeatured', '==', true)
        .orderBy('publishedAt', 'desc')
        .limit(3)
        .get();
      return snap.docs
        .map((doc) => {
          const d = doc.data();
          if (!d.slug || !d.cover?.path) return null;
          return {
            slug: String(d.slug),
            client: String(d.client ?? ''),
            title: String(d.title ?? ''),
            summary: String(d.summary ?? ''),
            tags: [String(d.industry ?? ''), ...(Array.isArray(d.tags) ? d.tags.map(String) : [])].filter(Boolean),
            services: Array.isArray(d.services) ? d.services : [],
            cover: {
              src: publicMediaUrl(d.cover.path),
              alt: String(d.cover.alt ?? ''),
              width: Number(d.cover.width ?? 1264),
              height: Number(d.cover.height ?? 848),
            },
            results: Array.isArray(d.results)
              ? d.results.slice(0, 3).map((r: { value?: unknown; label?: unknown }) => ({
                  value: String(r.value ?? ''),
                  label: String(r.label ?? ''),
                }))
              : [],
          } satisfies CaseStudySummary;
        })
        .filter((x): x is CaseStudySummary => x !== null);
    } catch (error) {
      console.error('Failed to read featured case studies', error);
      return [];
    }
  },
  ['case-studies:featured'],
  { tags: ['projects'], revalidate: 3600 }
);

export async function getFeaturedCaseStudies(): Promise<CaseStudySummary[]> {
  const items = await readFeatured();
  return items.length > 0 ? items : fallbackCaseStudies;
}

/** Up to `limit` case studies for a service page, newest first. */
export async function getCaseStudiesForService(slug: string, limit = 2): Promise<CaseStudySummary[]> {
  const pool = await getFeaturedCaseStudies();
  const matching = pool.filter((c) => c.services.some((s) => s === slug));
  const rest = pool.filter((c) => !matching.includes(c));
  return [...matching, ...rest].slice(0, limit);
}
