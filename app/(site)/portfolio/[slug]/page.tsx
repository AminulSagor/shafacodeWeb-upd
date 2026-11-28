import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { CreativeWork, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { CaseStudyCard, caseStudyHref } from '@/components/site/cards/case-study-card';
import { JsonLd } from '@/components/site/json-ld';
import { Markdown } from '@/components/site/markdown';
import { TechTile } from '@/components/site/tech-tile';
import { CtaBand } from '@/components/site/sections/cta-band';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { site } from '@/content/site';
import { getCaseStudies, getCaseStudy, getRelatedCaseStudies } from '@/lib/data/case-studies';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

/** Seed slugs are prerendered; CMS slugs render on demand. */
/** Prerender the live case studies; any other slug renders on demand. */
export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCaseStudy(slug);
  if (!item) return { title: 'Case study not found', robots: { index: false, follow: true } };
  return buildMetadata({
    title: item.title,
    description: item.lede ?? item.summary,
    path: caseStudyHref(item.slug),
    image: item.cover?.src,
    type: 'article',
  });
}

/** Case study template. Figma: Case Study 45:5717 (mobile 53:14315) */
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCaseStudy(slug);
  if (!item) notFound();
  const related = await getRelatedCaseStudies(item);

  const facts = [
    { label: 'Client', value: item.client },
    { label: 'Industry', value: item.industry ?? item.tags[0] },
    { label: 'Services', value: item.servicesLabel ?? item.tags.slice(1).join(' · ') },
    { label: 'Timeline', value: item.timeline },
    { label: 'Stack', value: item.stackLabel ?? item.stack?.slice(0, 2).join(' · ') },
    { label: 'Status', value: item.delivery === 'ongoing' ? 'Ongoing' : 'Delivered' },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  const ld: WithContext<CreativeWork> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: item.lede ?? item.summary,
    url: absoluteUrl(caseStudyHref(item.slug)),
    image: item.cover ? absoluteUrl(item.cover.src) : undefined,
    creator: { '@type': 'Organization', name: site.name, url: site.url },
    about: item.client ? { '@type': 'Organization', name: item.client } : undefined,
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[
          { name: 'Portfolio', path: '/portfolio' },
          { name: item.client || item.title, path: caseStudyHref(item.slug) },
        ]}
        eyebrow={`Case study${item.industry ?? item.tags[0] ? ` · ${item.industry ?? item.tags[0]}` : ''}`}
        title={
          item.headline ? (
            <>
              {item.headline.before} <Accent>{item.headline.accent}</Accent>
            </>
          ) : (
            item.title
          )
        }
        lede={item.lede ?? item.summary}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={`/contact?type=project&ref=${item.slug}`}>
                Start a similar project <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/portfolio">View more work</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Project facts" className="container-page">
        <dl className="grid grid-cols-2 overflow-hidden rounded-md border border-line-subtle bg-surface-1 md:grid-cols-3 xl:grid-cols-6">
          {facts.map((f) => (
            <div key={f.label} className="-mt-px -ml-px flex flex-col gap-1.5 border-t border-l border-line-subtle p-5">
              <dt className="type-mono-xs text-fg-subtle">{f.label}</dt>
              <dd className="type-body-sm font-medium text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {item.cover && (
        <div className="container-page mt-7">
          <div className="relative aspect-4/3 overflow-hidden rounded-card border border-line md:aspect-1240/460">
            <Image src={item.cover.src} alt={item.cover.alt} fill preload sizes="(min-width: 1340px) 1240px, 92vw" className="object-cover" />
          </div>
        </div>
      )}

      {item.stats && item.stats.length > 0 && (
        <section aria-labelledby="results-title" className="section-y">
          <div className="container-page">
            <SectionHeader
              id="results-title"
              eyebrow="Results"
              title={
                <>
                  What changed <Accent>after launch</Accent>
                </>
              }
              lede="Measured in the first three months after launch."
              ledeBelow
            />
            <dl className="mt-10 grid grid-cols-2 gap-3 md:gap-grid xl:grid-cols-4">
              {item.stats.map((s) => (
                <div key={s.label} className="flex flex-col rounded-md border border-line-subtle bg-surface-1 p-5 md:p-6">
                  <dt className="order-last mt-1 type-caption font-normal text-fg-subtle">{s.label}</dt>
                  <dd className="type-stat text-fg">
                    {s.value}
                    {s.unit && <span className="text-fg-brand">{s.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {(item.challenge || item.solution) && (
        <section aria-label="Story" className={item.stats?.length ? 'pb-section' : 'section-y'}>
          <div className={`container-page grid gap-grid ${item.challenge && item.solution ? 'md:grid-cols-2' : ''}`}>
            {item.challenge && (
              <div className="rounded-md border border-line-subtle bg-surface-1 p-card md:p-card-lg">
                <h2 className="type-h3 text-fg">
                  The <Accent className="md:inline">challenge</Accent>
                </h2>
                <p className="mt-4 type-body-lg text-fg-muted">{item.challenge}</p>
              </div>
            )}
            {item.solution && (
              <div className="rounded-md border border-line-subtle bg-surface-1 p-card md:p-card-lg">
                <h2 className="type-h3 text-fg">
                  Our <Accent className="md:inline">solution</Accent>
                </h2>
                <p className="mt-4 type-body-lg text-fg-muted">{item.solution}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {item.body && (
        <section aria-label="About the project" className="section-y">
          <div className="container-page max-w-220">
            <Markdown>{item.body}</Markdown>
          </div>
        </section>
      )}

      {item.gallery && item.gallery.length > 0 && (
        <section aria-label="Gallery" className="bg-surface-1 section-y">
          <ul className="container-page grid gap-grid md:grid-cols-3">
            {item.gallery.map((g, i) => {
              const wide = i === 3;
              return (
                <li
                  key={g.src}
                  className={`relative overflow-hidden rounded-md border border-line ${wide ? 'aspect-video md:col-span-3 md:aspect-1240/400' : 'aspect-4/3 md:aspect-397/400'}`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes={wide ? '(min-width: 1340px) 1240px, 92vw' : '(min-width: 1280px) 397px, (min-width: 768px) 31vw, 92vw'}
                    className="object-cover"
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(item.quote || (item.stack && item.stack.length > 0)) && (
        <section aria-label="Client voice and stack" className="pt-6">
          <div className="container-page">
            {item.quote && (
              <figure className="grid gap-6 py-8 xl:grid-cols-[--spacing(75)_1fr] xl:items-start xl:gap-6">
                <Eyebrow as="div">Client voice</Eyebrow>
                <div>
                  <blockquote className="max-w-225 type-h4 text-fg xl:type-h3">
                    <p>
                      “{item.quote.text} {item.quote.accent && <Accent className="md:inline">{item.quote.accent}</Accent>}
                      {item.quote.after}”
                    </p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-surface-2 type-label-sm text-fg">
                      {item.quote.initials}
                    </span>
                    <span className="flex flex-col">
                      <span className="type-label-sm text-fg">{item.quote.role}</span>
                      <span className="type-caption font-normal text-fg-subtle">{item.quote.company}</span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            )}
            {item.stack && item.stack.length > 0 && (
              <div className="grid gap-4 border-t border-line-subtle py-8 xl:grid-cols-[--spacing(75)_1fr] xl:items-center xl:gap-6">
                <Eyebrow as="div">Built with</Eyebrow>
                <ul className="flex flex-wrap gap-x-4">
                  {item.stack.map((t) => (
                    <li key={t}>
                      <TechTile name={t} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y">
          <div className="container-page">
            <SectionHeader
              id="related-title"
              eyebrow="More work"
              title={
                <>
                  Related <Accent>case studies</Accent>
                </>
              }
            />
            <ul className="mt-section-head grid gap-grid md:grid-cols-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <CaseStudyCard item={c} />
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
