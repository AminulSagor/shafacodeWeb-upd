import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { Service as ServiceLd, WithContext } from 'schema-dts';

import { cn } from '@/lib/utils';
import { Accent } from '@/components/ui/accent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/site/json-ld';
import { ScopeEstimator } from '@/components/site/interactive/scope-estimator';
import { CtaBand } from '@/components/site/sections/cta-band';
import { FaqSection } from '@/components/site/sections/faq-section';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { pricingFaqs } from '@/content/faq';
import { packageComparison, packageTiers } from '@/content/pricing';
import { site } from '@/content/site';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Packages and pricing',
  description:
    'Starting prices for websites, apps, SaaS platforms and complete digital products, plus an instant estimate for your scope.',
  path: '/packages',
});

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <>
        <span aria-hidden className="mx-auto block size-2 rounded-full bg-action-primary" />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false) return <span className="text-fg-subtle">Not included</span>;
  return <>{value}</>;
}

/** Packages. Figma: Packages 51:7901 (mobile 53:16697) */
export default function PackagesPage() {
  const ld: WithContext<ServiceLd> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Software development packages',
    url: absoluteUrl('/packages'),
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Starting packages',
      itemListElement: packageTiers.map((t) => ({
        '@type': 'Offer',
        name: t.name,
        description: t.audience,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'BDT',
          minPrice: Number(t.price.replace(/[^\d]/g, '')) * (t.price.includes('k') ? 1000 : 1),
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ name: 'Packages', path: '/packages' }]}
        eyebrow="Packages & pricing"
        title={
          <>
            Clear starting prices, <Accent>no surprises</Accent>
          </>
        }
        lede="Flexible packages for websites, apps, SaaS platforms and complete digital products. Final pricing depends on features, timeline, integrations and support needs."
      />

      <section aria-labelledby="estimate-title" className="pb-section">
        <div className="container-page grid items-center gap-10 xl:grid-cols-[minmax(0,--spacing(140))_minmax(0,--spacing(150))] xl:justify-between">
          <div>
            <h2 id="estimate-title" className="type-h2 text-fg">
              Start with a <Accent>ten-second</Accent> estimate
            </h2>
            <p className="mt-6 type-body-lg text-fg-muted">
              Pick what you are building and your must-haves. You get a ballpark range, timeline and team, then send the
              scope straight to us.
            </p>
          </div>
          <ScopeEstimator />
        </div>
      </section>

      <section id="tiers" aria-labelledby="tiers-title" className="bg-surface-1 section-y">
        <div className="container-page">
          <SectionHeader
            id="tiers-title"
            eyebrow="Packages"
            title={
              <>
                Three <Accent>starting points</Accent>
              </>
            }
            lede="Every package includes a project lead, weekly updates and full source-code ownership."
          />
          <ul className="mt-section-head grid gap-grid lg:grid-cols-3">
            {packageTiers.map((t) => (
              <li key={t.id}>
                <article
                  aria-labelledby={`tier-${t.id}`}
                  className={cn(
                    'flex h-full flex-col rounded-md border p-card md:p-6',
                    t.popular ? 'border-brand-soft-border bg-brand-soft' : 'border-line-subtle bg-canvas'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 id={`tier-${t.id}`} className="type-h4 text-fg">
                      {t.name}
                    </h3>
                    {t.popular && (
                      <Badge tone="brand" dot>
                        Most popular
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 type-body-sm text-fg-muted">{t.audience}</p>
                  <p className="mt-6 type-mono-xs text-fg-subtle">Starting from</p>
                  <p className="mt-1 type-stat text-fg">{t.price}</p>
                  <p className="mt-1 type-caption font-normal text-fg-subtle">{t.usd}</p>
                  <ul className="mt-6 flex flex-col gap-2.5 border-t border-line-subtle pt-6">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 type-body-sm text-fg-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-icon-brand" strokeWidth={2.5} aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button asChild variant={t.popular ? 'primary' : 'secondary'} className="w-full" size="md">
                      <Link href={t.href}>
                        {t.cta} <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="compare-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="compare-title"
            eyebrow="Compare"
            title={
              <>
                What&apos;s <Accent>included</Accent> in each package
              </>
            }
          />
          <div
            role="region"
            tabIndex={0}
            aria-labelledby="compare-title"
            className="relative mt-section-head overflow-x-auto rounded-md border border-line-subtle focus-visible:focus-ring"
          >
            <table className="w-full min-w-160 border-collapse type-body-sm">
              <caption className="sr-only">Features included in the Basic, App + Website and Premium packages</caption>
              <thead>
                <tr className="bg-surface-1">
                  <th scope="col" className="px-5 py-3.5 text-left type-mono-xs font-medium text-fg-subtle">
                    Feature
                  </th>
                  {['Basic', 'App + Website', 'Premium'].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={cn('px-5 py-3.5 text-center type-mono-xs font-medium text-fg-subtle', i === 1 && 'bg-brand-soft text-fg-brand')}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packageComparison.map((row) => (
                  <tr key={row.feature} className="border-t border-line-subtle">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-fg">
                      {row.feature}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={cn('px-5 py-4 text-center text-fg-muted', i === 1 && 'bg-brand-soft')}>
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-grid flex flex-col items-start gap-5 rounded-md border border-line-subtle bg-surface-1 p-card md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <h2 className="type-h4 text-fg">Need a dedicated team or something bigger?</h2>
              <p className="mt-1.5 type-body-sm text-fg-muted">
                Monthly product teams for SaaS and platforms, with a named lead and sprint reviews.
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/contact?type=saas">
                Talk to us about a team <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FaqSection
        className="border-t border-line-subtle"
        items={pricingFaqs}
        title={
          <>
            Pricing <Accent>questions</Accent>
          </>
        }
      />

      <CtaBand showSteps={false} />
    </>
  );
}
