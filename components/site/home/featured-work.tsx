import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/site/sections/section-header';
import type { CaseStudySummary } from '@/content/case-studies';

const caseHref = (slug: string) => `/portfolio/${slug}`;

function Meta({ tags, suffix }: { tags: string[]; suffix?: string }) {
  return <p className="type-mono-xs text-fg-brand">{[...tags, suffix].filter(Boolean).join(' · ')}</p>;
}

function FeatureCase({ item }: { item: CaseStudySummary }) {
  return (
    <article className="group relative grid items-center gap-8 xl:grid-cols-2 xl:gap-14">
      <div className="relative aspect-[592/440] overflow-hidden rounded-card bg-surface-1">
        {item.cover && (
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            sizes="(min-width: 1280px) 592px, 92vw"
            className="object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-col">
        <Meta tags={item.tags} suffix="Case study 01" />
        <h3 className="mt-6 type-h3 text-fg">
          <Link href={caseHref(item.slug)} className="rounded-sm focus-visible:focus-ring">
            {item.title}
          </Link>
        </h3>
        <p className="mt-6 type-body-lg text-fg-muted">{item.summary}</p>
        {item.results.length > 0 && (
          <dl className="mt-6 grid grid-cols-[0.9fr_1fr_1fr] border-y border-line-subtle">
            {item.results.map((r, i) => (
              <div
                key={r.label}
                className={`flex flex-col py-5 ${i > 0 ? 'border-l border-line-subtle pl-4 md:pl-5' : 'pr-4'}`}
              >
                <dt className="order-last mt-1.5 type-mono-xs text-fg-subtle">{r.label}</dt>
                <dd className="type-h3 whitespace-nowrap text-fg tabular md:type-h2">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-6">
          <Button asChild variant="secondary" size="md">
            <Link href={caseHref(item.slug)} aria-label={`Read the case study: ${item.client}`}>
              Read the case study <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function CaseCard({ item }: { item: CaseStudySummary }) {
  return (
    <article className="group card-focus relative flex h-full flex-col rounded-card">
      <div className="relative aspect-[600/340] overflow-hidden rounded-card bg-surface-1">
        {item.cover && (
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 46vw, 92vw"
            className="object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="mt-5">
        <Meta tags={item.tags} />
      </div>
      <h3 className="mt-5 type-h4 text-fg">
        <Link href={caseHref(item.slug)} className="after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>
      <p className="mt-5 type-body text-fg-muted">{item.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 type-label-sm text-fg-brand" aria-hidden>
        Read the case study
        <ArrowRight className="size-4 shrink-0 transition-transform duration-(--duration-fast) motion-safe:group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

/** Figma: Featured work 93:18971 (all visible, no carousel) */
export function FeaturedWork({ items }: { items: CaseStudySummary[] }) {
  if (items.length === 0) return null;
  const [feature, ...rest] = items;
  return (
    <section aria-labelledby="work-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="work-title"
          eyebrow="Featured work"
          title={
            <>
              Recent work that shows <Accent>how we think</Accent>
            </>
          }
          lede="How we turn client problems into usable, scalable and business-ready digital products."
        />
        <div className="mt-section-head flex flex-col gap-14">
          <FeatureCase item={feature} />
          {rest.length > 0 && (
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
              {rest.slice(0, 2).map((item) => (
                <CaseCard key={item.slug} item={item} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-14 flex md:justify-end">
          <Button asChild variant="secondary" size="lg" className="max-md:w-full">
            <Link href="/portfolio">
              Browse all case studies <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
