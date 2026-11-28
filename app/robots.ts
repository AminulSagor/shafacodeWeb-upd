import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { isProduction } from '@/lib/seo';
import { getSiteSettings } from '@/lib/settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  if (!isProduction || !settings.allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/login'] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
