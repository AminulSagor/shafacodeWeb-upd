import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { services } from '@/content/services';

/** Static routes for now; case studies, posts and jobs are added with their pages. */
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
  return [
    ...staticRoutes.map((path) => ({ url: `${site.url}${path}`, lastModified: now })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now })),
  ];
}
