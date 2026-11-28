import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Crosshair, ShieldCheck, Users } from 'lucide-react';
import type { ItemList, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/site/json-ld';
import { ServiceCard } from '@/components/site/cards/service-card';
import { FeatureCard } from '@/components/site/cards/feature-card';
import { CtaBand } from '@/components/site/sections/cta-band';
import { FaqSection } from '@/components/site/sections/faq-section';
import { LifecycleSteps } from '@/components/site/sections/lifecycle-steps';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { servicesFaqs } from '@/content/faq';
import { lifecycleSteps } from '@/content/process';
import { serviceHref, services } from '@/content/services';
import { site } from '@/content/site';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Software development services',
  description:
    'Custom software, web apps, mobile apps, SaaS, UI/UX design, WordPress and IoT systems, built with clear milestones and scalable engineering.',
  path: '/services',
});

const models = [
  {
    icon: Crosshair,
    title: 'Fixed-scope project',
    body: 'Clear requirements, a fixed estimate and milestone-based payments. Best for websites, MVPs and well-defined apps.',
  },
  {
    icon: Users,
    title: 'Dedicated product team',
    body: 'A designer and engineers working as your product team on a monthly plan. Best for ongoing SaaS and platform work.',
  },
  {
    icon: ShieldCheck,
    title: 'Support & maintenance',
    body: 'Monitoring, updates, security patches and small improvements after launch, with agreed response times.',
  },
];

function servicesListLd(): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} services`,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(serviceHref(s.slug)),
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.summary,
        url: absoluteUrl(serviceHref(s.slug)),
        provider: { '@type': 'Organization', name: site.name, url: site.url },
      },
    })),
  };
}

/** Services. Figma: Services 28:3276 (mobile 53:12912) */
export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesListLd()} />
      <PageHero
        crumbs={[{ name: 'Services', path: '/services' }]}
        eyebrow="Services"
        title={
          <>
            Services built for <Accent>modern digital growth</Accent>
          </>
        }
        lede="From UI/UX design to full-scale software development, ShafaCode helps businesses build websites, apps, SaaS platforms, custom systems and IoT solutions with clarity, speed and scalable execution."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/contact?type=consultation">
                Book a free consultation <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/portfolio">View our work</Link>
            </Button>
          </>
        }
      />

      <section aria-labelledby="all-services-title" className="pt-6 pb-[var(--section-y)]">
        <div className="container-page">
          <h2 id="all-services-title" className="sr-only">
            All services
          </h2>
          <ul className="grid gap-[var(--grid-gap)] md:grid-cols-2 xl:grid-cols-3">
            {services.map((s, i) => {
              // A lone last card spans the full row (Figma: wide IoT card).
              const wide = i === services.length - 1 && services.length % 6 === 1;
              return (
                <li key={s.slug} className={wide ? 'md:col-span-2 xl:col-span-3' : undefined}>
                  <ServiceCard service={s} index={i} wide={wide} />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="models-title" className="bg-surface-1 section-y">
        <div className="container-page">
          <SectionHeader
            id="models-title"
            eyebrow="Ways to work together"
            title={
              <>
                Pick the engagement that <Accent>fits your stage</Accent>
              </>
            }
            lede="Every model comes with a named project lead, weekly updates and full ownership of the code."
          />
          <ul className="mt-[var(--section-head-gap)] grid gap-[var(--grid-gap)] lg:grid-cols-3">
            {models.map((m) => (
              <li key={m.title}>
                <FeatureCard {...m} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="process" aria-labelledby="process-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="process-title"
            eyebrow="Our lifecycle"
            title={
              <>
                How we turn services into <Accent>real products</Accent>
              </>
            }
            lede="A high-precision lifecycle that keeps every project clear, tested and on schedule."
          />
          <div className="mt-[var(--section-head-gap)]">
            <LifecycleSteps steps={lifecycleSteps} />
          </div>
        </div>
      </section>

      <FaqSection
          className="border-t border-line-subtle"
          items={servicesFaqs}
          title={
            <>
              Questions about <Accent>our services</Accent>
            </>
          }
        />

      <CtaBand
        showSteps={false}
        title={
          <>
            Not sure <Accent>which service</Accent> you need?
          </>
        }
        body="Tell us about your idea, goal or business problem. We will help you choose the right solution, timeline and budget."
      />
    </>
  );
}
