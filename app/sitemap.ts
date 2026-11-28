import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { services } from '@/content/services';
import { getCaseStudies } from '@/lib/data/case-studies';
import { getJobs } from '@/lib/data/jobs';
import { getPosts } from '@/lib/data/posts';

/** Static routes, services, case studies, posts and open roles. Apply pages are noindex and left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    '',
    '/services',
    '/portfolio',
    '/blogs',
    '/careers',
    '/about',
    '/contact',
    '/packages',
    '/affiliate',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
  ];
  const [caseStudies, posts, jobs] = await Promise.all([getCaseStudies(), getPosts(), getJobs()]);
  return [
    ...staticRoutes.map((path) => ({ url: `${site.url}${path}`, lastModified: now })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now })),
    ...caseStudies.map((c) => ({ url: `${site.url}/portfolio/${c.slug}`, lastModified: now })),
    ...posts.map((p) => ({ url: `${site.url}/blogs/${p.slug}`, lastModified: new Date(p.updatedAt) })),
    ...jobs.map((j) => ({ url: `${site.url}/careers/${j.slug}`, ...(j.postedAt ? { lastModified: new Date(j.postedAt) } : {}) })),
  ];
}
