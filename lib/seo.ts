import type { Metadata } from 'next';

import { site } from '@/content/site';

type SeoInput = {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
};

/** True only on the production deployment; every other deployment is noindex. */
export const isProduction =
  (process.env.APP_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV) === 'production';

/** Per-route metadata. Omits images so the route's opengraph-image applies. */
export function buildMetadata(p: SeoInput): Metadata {
  const images = p.image ? { images: [p.image] } : {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.canonical ?? p.path },
    openGraph: {
      title: p.title,
      description: p.description,
      url: p.path,
      type: p.type ?? 'website',
      siteName: site.name,
      locale: 'en_US',
      ...images,
    },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, ...images },
    robots: p.noIndex ? { index: false, follow: true } : undefined,
  };
}

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
