import type { WebPage, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { JsonLd } from '@/components/site/json-ld';
import { Markdown } from '@/components/site/markdown';
import { TableOfContents } from '@/components/site/article/table-of-contents';
import { PageHero } from '@/components/site/sections/page-hero';
import type { LegalDoc } from '@/content/legal';
import { extractToc } from '@/lib/markdown';
import { absoluteUrl } from '@/lib/seo';

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Legal template. Figma: Privacy Policy 52:8946 (mobile 53:17718) */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const toc = extractToc(doc.body);
  const ld: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${doc.title} ${doc.accent}`,
    description: doc.description,
    url: absoluteUrl(`/${doc.slug}`),
    dateModified: doc.updated,
  };
  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ name: `${doc.title} ${doc.accent}`, path: `/${doc.slug}` }]}
        eyebrow={`Legal · Last updated ${fmt.format(new Date(doc.updated))}`}
        title={
          <>
            {doc.title} <Accent>{doc.accent}</Accent>
          </>
        }
        lede={doc.description}
      />
      <div className="container-page grid gap-10 pb-section xl:grid-cols-[minmax(0,1fr)_--spacing(75)] xl:gap-grid">
        {/* TOC first in the DOM so focus order matches the visual order on every width. */}
        <aside aria-label="On this page" className="xl:sticky xl:top-sticky xl:col-start-2 xl:row-start-1 xl:self-start">
          <TableOfContents items={toc} />
        </aside>
        <div className="min-w-0 xl:col-start-1 xl:row-start-1 xl:max-w-220 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:type-h4 [&_p]:my-3 [&_p]:type-body">
          <Markdown>{doc.body}</Markdown>
        </div>
      </div>
    </>
  );
}
