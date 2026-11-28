import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { BlogPosting, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { BlogCard, formatDate, postHref } from '@/components/site/cards/blog-card';
import { JsonLd } from '@/components/site/json-ld';
import { Markdown } from '@/components/site/markdown';
import { ReadingProgress } from '@/components/site/article/reading-progress';
import { ShareLinks } from '@/components/site/article/share-links';
import { TableOfContents } from '@/components/site/article/table-of-contents';
import { CtaBand } from '@/components/site/sections/cta-band';
import { categoryLabel, fallbackPosts } from '@/content/blog';
import { site } from '@/content/site';
import { getPost, getRelatedPosts } from '@/lib/data/posts';
import { extractToc } from '@/lib/markdown';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return fallbackPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article not found', robots: { index: false, follow: true } };
  return buildMetadata({
    title: post.title,
    description: post.excerpt || `${post.title}: a guide from the ${site.name} team.`,
    path: postHref(post.slug),
    image: post.cover?.src,
    type: 'article',
  });
}

/** Blog article. Figma: Blog Article 48:6234 (mobile 53:14898) */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const toc = extractToc(post.content);
  const url = absoluteUrl(postHref(post.slug));
  const updated = post.updatedAt !== post.publishedAt && post.updatedAt > post.publishedAt;

  const ld: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover ? absoluteUrl(post.cover.src) : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author.name, jobTitle: post.author.role },
    publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: absoluteUrl('/icon.png') },
    mainEntityOfPage: url,
    articleSection: categoryLabel(post.category),
    wordCount: post.content.split(/\s+/).length,
  };

  return (
    <>
      <JsonLd data={ld} />
      <ReadingProgress targetId="article-body" />

      <article aria-labelledby="page-title">
        <header className="container-page pt-article-top">
          <Breadcrumbs
            items={[
              { name: 'Blog', path: '/blogs' },
              { name: post.title, path: postHref(post.slug) },
            ]}
            className="[&_li:last-child>span]:line-clamp-1"
          />
          <Eyebrow as="div" className="mt-5">
            <Link href={`/blogs?category=${encodeURIComponent(post.category)}#latest`} className="rounded-sm hover:underline focus-visible:focus-ring">
              {categoryLabel(post.category)}
            </Link>
          </Eyebrow>
          <h1 id="page-title" className="mt-3 max-w-[920px] type-h1 text-fg">
            {post.headline ? (
              <>
                {post.headline.before} <Accent>{post.headline.accent}</Accent>
              </>
            ) : (
              post.title
            )}
          </h1>
          <div className="mt-5 flex items-center gap-3">
            {post.author.photo && (
              <Image src={post.author.photo} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
            )}
            <div className="flex flex-col">
              <span className="type-label-sm text-fg">{post.author.name}</span>
              <span className="type-caption font-normal text-fg-subtle">
                {post.author.role && `${post.author.role} · `}Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {updated && (
                  <>
                    {' '}
                    · Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </>
                )}{' '}
                · {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </header>

        {post.cover && (
          <div className="container-page mt-8 md:mt-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-1 md:aspect-[1240/460]">
              <Image src={post.cover.src} alt={post.cover.alt} fill preload sizes="(min-width: 1340px) 1240px, 92vw" className="object-cover" />
            </div>
          </div>
        )}

        <div className="container-page grid gap-12 pt-10 pb-section md:pt-14 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-grid">
          <div id="article-body" className="min-w-0 xl:max-w-[720px]">
            <Markdown>{post.content}</Markdown>

            <aside aria-label="About the author" className="mt-12 flex items-center gap-4 rounded-md border border-line-subtle bg-surface-1 p-5">
              {post.author.photo && (
                <Image src={post.author.photo} alt="" width={56} height={56} className="size-14 shrink-0 rounded-full object-cover" />
              )}
              <div>
                <p className="type-h5 text-fg">{post.author.name}</p>
                {post.author.bio && <p className="mt-1 type-body-sm text-fg-muted">{post.author.bio}</p>}
              </div>
            </aside>
          </div>

          <aside aria-label="Article tools" className="flex flex-col gap-4 xl:sticky xl:top-sticky xl:self-start">
            <div className="max-xl:hidden">
              <TableOfContents items={toc} />
            </div>
            <div className="rounded-md border border-brand-soft-border bg-brand-soft p-4">
              <p className="type-h5 text-fg">Need a precise estimate?</p>
              <p className="mt-1.5 type-body-sm text-fg-muted">Let&apos;s map your architecture and a reliable roadmap.</p>
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href="/contact?type=estimate">
                  Free consultation <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
            <ShareLinks url={url} title={post.title} />
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-surface-1 section-y">
          <div className="container-page">
            <h2 id="related-title" className="type-h2 text-fg">
              Keep <Accent>reading</Accent>
            </h2>
            <ul className="mt-section-head grid gap-grid md:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand showSteps={false} />
    </>
  );
}
