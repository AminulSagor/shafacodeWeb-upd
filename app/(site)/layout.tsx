import type { Metadata, Viewport } from 'next';

import '../globals.css';
import { fontVariables } from '../fonts';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { site } from '@/content/site';
import { isProduction } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: transparent software partner for growing teams`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: 'website', locale: 'en_US', siteName: site.name },
  twitter: { card: 'summary_large_image' },
  // Every deployment that is not production stays out of search results.
  robots: isProduction ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0d100f',
  colorScheme: 'dark',
};

/** Root layout of the public site: dark theme, site density. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-ui="site" className={fontVariables}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-button-sm bg-action-primary px-4 py-2 type-label-sm text-fg-on-brand focus-visible:translate-y-0 focus-visible:focus-ring"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
