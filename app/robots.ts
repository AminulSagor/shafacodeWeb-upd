import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { isProduction } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/login'] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
