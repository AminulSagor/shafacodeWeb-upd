import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Blog, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { chipClassName } from '@/components/ui/chip-styles';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Input } from '@/components/ui/input';
import { BlogCard, postHref } from '@/components/site/cards/blog-card';
import { JsonLd } from '@/components/site/json-ld';
import { PaginationLinks } from '@/components/site/pagination-links';
import { CtaBand } from '@/components/site/sections/cta-band';
import { PageHero } from '@/components/site/sections/page-hero';
import { categoryLabel } from '@/content/blog';
import { site } from '@/content/site';
import { getPosts } from '@/lib/data/posts';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type SearchParams = Promise<{ category?: string; q?: string; page?: string }>;

const PER_PAGE = 6;

function parse(p: Awaited<SearchParams>) {
  return {
    category: p.category?.trim() || undefined,
    q: p.q?.trim().slice(0, 80) || undefined,
    page: Math.max(1, Math.floor(Number(p.page) || 1)),
  };
}

function hrefWith(f: ReturnType<typeof parse>, patch: Partial<ReturnType<typeof parse>>) {
  const n = { ...f, ...patch };
  const q = new URLSearchParams();
  if (n.category) q.set('category', n.category);
  if (n.q) q.set('q', n.q);
  if (n.page > 1) q.set('page', String(n.page));
  const s = q.toString();
  return s ? `/blogs?${s}#latest` : '/blogs#latest';
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const f = parse(await searchParams);
  const filters = [f.category, f.q].filter(Boolean).length;
  return buildMetadata({
    title: f.page > 1 ? `Blog, page ${f.page}` : 'Blog: guides on software, apps and UI/UX',
    description:
      'Practical guides on software development, UI/UX, app development, business automation, SaaS and digital growth.',
    path: '/blogs',
    // Paginated pages are self-canonical; filtered or searched views point to the list.
    canonical: filters === 0 && f.page > 1 ? `/blogs?page=${f.page}` : '/blogs',
    noIndex: filters >= 1 && (filters >= 2 || Boolean(f.q)),
  });
}

/** Blog. Figma: Blog 48:5885 (mobile 53:14611) */
export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const f = parse(await searchParams);
  const all = await getPosts();
  const categories = [...new Set(all.map((p) => p.category))];

  const unfiltered = !f.category && !f.q;
  const featured = unfiltered && f.page === 1 ? (all.find((p) => p.featured) ?? all[0]) : undefined;

  const needle = f.q?.toLowerCase();
  const list = all.filter(
    (p) =>
      p !== featured &&
      (!f.category || p.category === f.category) &&
      (!needle || `${p.title} ${p.excerpt}`.toLowerCase().includes(needle))
  );
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(f.page, totalPages);
  const visible = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const ld: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${site.name} blog`,
    url: absoluteUrl('/blogs'),
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    blogPost: all.slice(0, 10).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(postHref(p.slug)),
      datePublished: p.publishedAt,
    })),
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ name: 'Blog', path: '/blogs' }]}
        eyebrow="Blog"
        title={
          <>
            Insights for building <Accent>better digital products</Accent>
          </>
        }
        lede="Practical guides on software development, UI/UX, app development, business automation, SaaS and digital growth."
      />

      {featured && (
        <section aria-labelledby="featured-title" className="container-page">
          <h2 id="featured-title" className="sr-only">
            Featured article
          </h2>
          <Eyebrow as="div" className="mb-6">
            Featured article
          </Eyebrow>
          <BlogCard post={featured} horizontal preload />
        </section>
      )}

      <section id="latest" aria-labelledby="latest-title" className="scroll-mt-nav-offset pt-6 pb-section xl:pt-24">
        <div className="container-page flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="latest-title" className="type-h2 text-fg">
              Latest technical <Accent>insights</Accent>
            </h2>
            <form action="/blogs#latest" method="get" role="search" className="relative w-full md:w-80">
              {f.category && <input type="hidden" name="category" value={f.category} />}
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-icon" aria-hidden />
              <Input id="blog-search" name="q" type="search" defaultValue={f.q} placeholder="Search articles…" className="pl-10" />
            </form>
          </div>

          {categories.length > 1 && (
            <nav aria-label="Topics" className="-mx-page overflow-x-auto px-page md:mx-0 md:overflow-visible md:px-0">
              <ul className="flex w-max gap-2 py-1 md:w-auto md:flex-wrap">
                <li>
                  <Link href={hrefWith(f, { category: undefined, page: 1 })} aria-current={!f.category ? 'page' : undefined} className={chipClassName(!f.category)}>
                    All topics
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link href={hrefWith(f, { category: c, page: 1 })} aria-current={f.category === c ? 'page' : undefined} className={chipClassName(f.category === c)}>
                      {categoryLabel(c)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {f.q && (
            <p className="type-body-sm text-fg-muted" role="status">
              {list.length} {list.length === 1 ? 'result' : 'results'} for “{f.q}”.{' '}
              <Link href={hrefWith(f, { q: undefined, page: 1 })} className="rounded-sm text-fg-brand underline underline-offset-4 focus-visible:focus-ring">
                Clear search
              </Link>
            </p>
          )}

          {visible.length > 0 ? (
            <ul className="grid gap-grid md:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-line-subtle p-10 text-center">
              <p className="type-h4 text-fg">{all.length === 0 ? 'Articles are on their way.' : 'No articles match that yet.'}</p>
              <p className="mt-2 type-body-sm text-fg-muted">Try another topic or search, or ask us directly.</p>
              <Button asChild variant="secondary" className="mt-6">
                <Link href="/blogs">Show all articles</Link>
              </Button>
            </div>
          )}

          <PaginationLinks current={page} total={totalPages} href={(n) => hrefWith(f, { page: n })} label="Blog pages" />
        </div>
      </section>

      <CtaBand showSteps={false} />
    </>
  );
}
