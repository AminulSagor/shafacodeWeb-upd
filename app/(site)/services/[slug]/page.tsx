import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { Service as ServiceLd, WithContext } from 'schema-dts';

import { AccentText } from '@/components/ui/accent-heading';
import { Button } from '@/components/ui/button';
import { TextLink } from '@/components/ui/text-link';
import { CaseStudyCard } from '@/components/site/cards/case-study-card';
import { FeatureCard } from '@/components/site/cards/feature-card';
import { JsonLd } from '@/components/site/json-ld';
import { TechTile } from '@/components/site/tech-tile';
import { CtaBand } from '@/components/site/sections/cta-band';
import { FaqSection } from '@/components/site/sections/faq-section';
import { LifecycleSteps } from '@/components/site/sections/lifecycle-steps';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { serviceDetails, serviceFaqs, serviceSteps } from '@/content/service-details';
import { getService, serviceHref, serviceSlugs } from '@/content/services';
import { site } from '@/content/site';
import { getCaseStudiesForService } from '@/lib/data/case-studies';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const d = serviceDetails[service.slug];
  return buildMetadata({ title: d.metaTitle, description: d.metaDescription, path: serviceHref(service.slug) });
}

/** Service template. Figma: 30:4583 (Web Application Development) and 53:8859 to 53:11345 */
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const d = serviceDetails[service.slug];
  const related = await getCaseStudiesForService(service.slug);

  const facts = [
    { label: 'Typical timeline', value: d.timeline },
    { label: 'How you pay', value: 'Per milestone' },
    { label: 'Your team', value: d.team },
    { label: 'Ownership', value: '100% your code' },
  ];

  const serviceLd: WithContext<ServiceLd> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: d.metaDescription,
    url: absoluteUrl(serviceHref(service.slug)),
    serviceType: service.title,
    areaServed: 'Worldwide',
    provider: { '@type': 'Organization', name: site.name, url: site.url },
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <PageHero
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: service.title, path: serviceHref(service.slug) },
        ]}
        eyebrow={d.eyebrow}
        title={<AccentText value={d.title} />}
        lede={d.lede}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={`/contact?type=${service.slug}`}>
                {d.primaryCta} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/portfolio?service=${service.slug}`}>{d.secondaryCta}</Link>
            </Button>
          </>
        }
      />

      <section aria-label="At a glance" className="container-page">
        <dl className="grid grid-cols-2 gap-3 md:gap-[var(--grid-gap)] xl:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5 rounded-md border border-line-subtle bg-surface-1 p-5">
              <dt className="type-mono-xs text-fg-subtle">{f.label}</dt>
              <dd className="type-h5 text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="build-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="build-title"
            eyebrow="What we build"
            title={<AccentText value={d.build.title} />}
            lede={d.build.lede}
            ledeBelow
          />
          <ul className="mt-[var(--section-head-gap)] grid gap-[var(--grid-gap)] md:grid-cols-2 xl:grid-cols-3">
            {d.build.items.map((item) => (
              <li key={item.title}>
                <FeatureCard icon={item.icon} title={item.title} body={item.body} className="bg-surface-1" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Best for and tech stack" className="section-y">
        <div className="container-page grid gap-12 md:grid-cols-2 md:gap-[var(--grid-gap)]">
          <div className="border-t border-line pt-7">
            <h2 className="type-h3 text-fg">Best for</h2>
            <p className="mt-5 type-body text-fg-muted">{d.bestFor.lede}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {d.bestFor.audiences.map((a) => (
                <li
                  key={a}
                  className="inline-flex h-9 items-center rounded-[var(--chip-radius)] bg-action-secondary px-3.5 type-label-sm text-fg-muted shadow-btn-secondary"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line pt-7">
            <h2 className="type-h3 text-fg">Tech stack</h2>
            <p className="mt-5 type-body text-fg-muted">{d.stack.lede}</p>
            <ul className="mt-3 flex flex-wrap gap-x-2">
              {d.stack.items.map((t) => (
                <li key={t}>
                  <TechTile name={t} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="bg-surface-1 section-y">
        <div className="container-page">
          <SectionHeader
            id="steps-title"
            eyebrow="Process & timeline"
            title={<AccentText value={d.process.title} />}
            lede={d.process.lede}
          />
          <div className="mt-[var(--section-head-gap)]">
            <LifecycleSteps steps={serviceSteps(d)} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y">
          <div className="container-page">
            <SectionHeader
              id="related-title"
              eyebrow="Case studies"
              title={<AccentText value={d.related.title} />}
              aside={
                <TextLink href={`/portfolio?service=${service.slug}`} className="xl:mt-auto xl:self-end">
                  {d.related.linkLabel}
                </TextLink>
              }
              className="xl:items-end"
            />
            <ul className="mt-[var(--section-head-gap)] grid gap-[var(--grid-gap)] md:grid-cols-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <CaseStudyCard item={c} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FaqSection className="border-t border-line-subtle" items={serviceFaqs(d)} title={<AccentText value={d.faqTitle} />} />

      <CtaBand showSteps={false} title={<AccentText value={d.ctaTitle} />} />
    </>
  );
}
