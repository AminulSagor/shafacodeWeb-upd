import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { services } from '@/content/services';
import { getCaseStudies } from '@/lib/data/case-studies';
import { getPosts } from '@/lib/data/posts';

/** Static routes, services and case studies; jobs are added with their pages. */
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
  const [caseStudies, posts] = await Promise.all([getCaseStudies(), getPosts()]);
  return [
    ...staticRoutes.map((path) => ({ url: `${site.url}${path}`, lastModified: now })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now })),
    ...caseStudies.map((c) => ({ url: `${site.url}/portfolio/${c.slug}`, lastModified: now })),
    ...posts.map((p) => ({ url: `${site.url}/blogs/${p.slug}`, lastModified: new Date(p.updatedAt) })),
  ];
}
