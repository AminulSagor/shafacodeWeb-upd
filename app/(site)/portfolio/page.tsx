import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CollectionPage, WithContext } from 'schema-dts';

import { cn } from '@/lib/utils';
import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { chipClassName } from '@/components/ui/chip-styles';
import { TextLink } from '@/components/ui/text-link';
import { CaseStudyCard, caseStudyHref } from '@/components/site/cards/case-study-card';
import { JsonLd } from '@/components/site/json-ld';
import { CtaBand } from '@/components/site/sections/cta-band';
import { PageHero } from '@/components/site/sections/page-hero';
import { portfolioCategories, type CaseStudy, type PortfolioCategory } from '@/content/case-studies';
import { getService } from '@/content/services';
import { site } from '@/content/site';
import { getCaseStudies } from '@/lib/data/case-studies';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { first, positiveInt, type RawSearchParams } from '@/lib/search-params';

type SearchParams = Promise<RawSearchParams>;

const PAGE_SIZE = 7;
const STEP = 6;

const stats = [
  { value: '120', unit: '+', label: 'Projects delivered' },
  { value: '15', unit: '+', label: 'Ongoing projects' },
  { value: '8', unit: '+', label: 'Years of experience' },
  { value: '99', unit: '%', label: 'Client satisfaction' },
];

const statuses = [
  { id: undefined, label: 'All' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'ongoing', label: 'Ongoing' },
] as const;

function parse(params: Awaited<SearchParams>) {
  const t = first(params.type);
  const sv = first(params.service);
  const st = first(params.status);
  const type = portfolioCategories.some((c) => c.id === t) ? (t as PortfolioCategory) : undefined;
  const service = sv && getService(sv) ? sv : undefined;
  const status = st === 'delivered' || st === 'ongoing' ? st : undefined;
  const show = Math.max(positiveInt(params.show, PAGE_SIZE, 200), PAGE_SIZE);
  return { type, service, status, show };
}

function hrefWith(current: ReturnType<typeof parse>, patch: Partial<ReturnType<typeof parse>>, hash = true) {
  const next = { ...current, ...patch };
  const q = new URLSearchParams();
  if (next.type) q.set('type', next.type);
  if (next.service) q.set('service', next.service);
  if (next.status) q.set('status', next.status);
  if (next.show && next.show !== PAGE_SIZE) q.set('show', String(next.show));
  const s = q.toString();
  const h = hash ? '#work' : '';
  return s ? `/portfolio?${s}${h}` : `/portfolio${h}`;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const f = parse(await searchParams);
  const filters = [f.type, f.service, f.status].filter(Boolean).length;
  const items = filterItems(await getCaseStudies(), f);
  return buildMetadata({
    title: 'Portfolio and case studies',
    description:
      'Selected web apps, mobile apps, SaaS platforms, dashboards, UI/UX and IoT projects by ShafaCode, with the results they delivered.',
    path: '/portfolio',
    // Filtered views point to the full list; two or more filters, or no results, stay out of the index.
    canonical: filters >= 2 || items.length === 0 ? undefined : '/portfolio',
    noIndex: filters >= 2 || items.length === 0,
  });
}

function filterItems(all: CaseStudy[], f: ReturnType<typeof parse>) {
  return all.filter(
    (c) =>
      (!f.type || c.categories.includes(f.type)) &&
      (!f.service || c.services.some((s) => s === f.service)) &&
      (!f.status || c.delivery === f.status)
  );
}

function FeatureCase({ item }: { item: CaseStudy }) {
  return (
    <article className={`group card-focus relative grid overflow-hidden rounded-md border border-line-subtle bg-surface-1 transition-[border-color] duration-(--duration-base) hover:border-line-brand ${item.cover ? 'xl:grid-cols-[--spacing(144.75)_1fr]' : ''}`}>
      {item.cover && (
        <div className="relative aspect-4/3 overflow-hidden xl:aspect-auto xl:min-h-115">
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            preload
            sizes="(min-width: 1280px) 579px, 92vw"
            className="object-cover transition-transform duration-(--duration-slow) ease-out motion-safe:group-hover:scale-103"
          />
        </div>
      )}
      <div className="flex flex-col justify-center gap-4 p-card md:p-card-lg">
        <p className="flex flex-wrap gap-x-2 type-mono-xs text-fg-subtle">
          {item.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
        <h3 className="type-h3 text-fg">
          <Link href={caseStudyHref(item.slug)} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className="type-body-sm text-fg-muted">{item.summary}</p>
        {item.results.length > 0 && (
          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
            {item.results.map((r) => (
              <div key={r.label} className="flex flex-col">
                <dt className="order-last type-caption font-normal text-fg-subtle">{r.label}</dt>
                <dd className="type-h3 text-fg-brand tabular">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className="mt-2 inline-flex items-center gap-1.5 type-label text-fg-brand" aria-hidden>
          Read the case study
          <ArrowRight className="size-4 shrink-0 transition-transform duration-(--duration-fast) motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}

/** Portfolio. Figma: Portfolio 45:5345 (mobile 53:13995) */
export default async function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const f = parse(await searchParams);
  const all = await getCaseStudies();
  const items = filterItems(all, f);
  const visible = items.slice(0, f.show);
  const [feature, ...rest] = visible;
  const serviceName = f.service ? getService(f.service)?.title : undefined;

  const ld: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${site.name} portfolio`,
    url: absoluteUrl('/portfolio'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: all.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(caseStudyHref(c.slug)),
        name: c.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ name: 'Portfolio', path: '/portfolio' }]}
        eyebrow="Portfolio"
        title={
          <>
            Our work in design, development and <Accent>digital products</Accent>
          </>
        }
        lede="Selected projects across web applications, mobile apps, dashboards, automation systems, UI/UX and backend platforms."
      />

      <section aria-label="Track record" className="container-page">
        <dl className="grid grid-cols-2 gap-3 md:gap-grid xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col rounded-md border border-line-subtle bg-surface-1 p-5 md:p-6">
              <dt className="order-last mt-1 type-caption font-normal text-fg-subtle">{s.label}</dt>
              <dd className="type-stat text-fg">
                {s.value}
                <span className="text-fg-brand">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="work" aria-labelledby="work-heading" className="scroll-mt-nav-offset section-y">
        <div className="container-page">
          <h2 id="work-heading" className="sr-only">
            {serviceName ? `${serviceName} case studies` : 'All case studies'}
          </h2>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <nav aria-label="Filter by type" className="-mx-page min-w-0 overflow-x-auto px-page pb-1 xl:mx-0 xl:overflow-visible xl:px-0">
              <ul className="flex w-max gap-2 py-1 pr-page xl:w-auto xl:flex-wrap xl:pr-0">
                <li>
                  <Link
                    href={hrefWith(f, { type: undefined, service: undefined, show: PAGE_SIZE })}
                    aria-current={!f.type && !f.service ? 'page' : undefined}
                    className={chipClassName(!f.type && !f.service)}
                  >
                    All projects
                    <span className={cn('type-mono-xs', !f.type && !f.service ? 'text-fg-on-brand' : 'text-fg-subtle')}>
                      {all.length}
                    </span>
                  </Link>
                </li>
                {portfolioCategories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={hrefWith(f, { type: c.id, service: undefined, show: PAGE_SIZE })}
                      aria-current={f.type === c.id ? 'page' : undefined}
                      className={chipClassName(f.type === c.id)}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Filter by status">
              <ul className="inline-flex gap-1 rounded-full border border-line-subtle p-1">
                {statuses.map((s) => {
                  const active = f.status === s.id;
                  return (
                    <li key={s.label}>
                      <Link
                        href={hrefWith(f, { status: s.id, show: PAGE_SIZE })}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'inline-flex h-8 items-center rounded-full px-3.5 type-label-sm transition-colors focus-visible:focus-ring',
                          active ? 'bg-action-primary text-fg-on-brand shadow-btn-primary' : 'text-fg-muted hover:text-fg'
                        )}
                      >
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {serviceName && (
            <p className="mt-6 flex flex-wrap items-center gap-3 type-body-sm text-fg-muted">
              Showing {serviceName} work.
              <TextLink href="/portfolio#work" arrow={false}>
                Show all projects
              </TextLink>
            </p>
          )}

          {items.length === 0 ? (
            <div className="mt-10 rounded-md border border-line-subtle p-10 text-center">
              <p className="type-h4 text-fg">No projects match these filters yet.</p>
              <p className="mt-2 type-body-sm text-fg-muted">Try another filter, or tell us what you want to build.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild variant="secondary">
                  <Link href="/portfolio#work">Show all projects</Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Start a project</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-grid">
              {feature && <FeatureCase item={feature} />}
              {rest.length > 0 && (
                <ul className="grid gap-grid md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((c) => (
                    <li key={c.slug}>
                      <CaseStudyCard item={c} sizes="(min-width: 1280px) 395px, (min-width: 768px) 46vw, 92vw" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {visible.length < items.length && (
                <Button asChild variant="secondary" size="lg">
                  <Link href={hrefWith(f, { show: f.show + STEP }, false)} scroll={false}>
                    Load more projects
                  </Link>
                </Button>
              )}
              <p className="type-mono-xs text-fg-subtle" aria-live="polite">
                Showing {visible.length} of {items.length}
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand showSteps={false} />
    </>
  );
}
