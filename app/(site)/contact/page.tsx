import type { Metadata } from 'next';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { ContactPage as ContactPageLd, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { ContactForm, type ContactPrefill } from '@/components/site/contact/contact-form';
import { TimezoneOverlap } from '@/components/site/interactive/timezone-overlap';
import { JsonLd } from '@/components/site/json-ld';
import { FaqSection } from '@/components/site/sections/faq-section';
import { PageHero } from '@/components/site/sections/page-hero';
import { sharedFaqs } from '@/content/faq';
import { estimate, estimatorFeatures, formatBdtK, projectTypes, type FeatureId, type ProjectTypeId } from '@/content/pricing';
import { site } from '@/content/site';
import { projectTypeOptions } from '@/lib/schemas/inquiry';
import { first, type RawSearchParams } from '@/lib/search-params';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { professionalServiceLd } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Contact ShafaCode: request a project estimate',
  description:
    'Share your idea, goals, timeline and budget range. We review every request and reply with clear next steps, usually within 12 hours.',
  path: '/contact',
});

const faqs = [
  {
    q: 'What should I include in my request?',
    a: 'Your goal, who will use the product, must-have features and any deadline. Rough ideas are fine; we help shape them.',
  },
  sharedFaqs.designAndDevelop,
  sharedFaqs.ownCode,
];

/** Map ?type= (estimator ids, service slugs, CTA intents) to a project type option. */
const typeAlias: Record<string, string> = {
  'web-app': 'web-app',
  website: 'website',
  'mobile-app': 'mobile-app',
  saas: 'saas',
  'custom-software-development': 'custom-software',
  'web-application-development': 'web-app',
  'mobile-app-development': 'mobile-app',
  'saas-development': 'saas',
  'ui-ux-design': 'ui-ux',
  'wordpress-development': 'wordpress',
  'iot-embedded-systems': 'iot',
};

function prefillFrom(p: RawSearchParams): ContactPrefill {
  const type = first(p.type);
  const projectType = type && typeAlias[type];
  const source = first(p.source) === 'estimator' ? 'estimator' : type ? 'home-cta' : 'contact-page';
  if (source !== 'estimator' || !type || !projectTypes.some((t) => t.id === type)) {
    return { projectType: projectType && projectTypeOptions.some((o) => o.value === projectType) ? projectType : undefined, source };
  }
  const features = (first(p.features) ?? '')
    .split(',')
    .filter((f): f is FeatureId => estimatorFeatures.some((e) => e.id === f));
  const r = estimate(type as ProjectTypeId, features);
  const typeLabel = projectTypes.find((t) => t.id === type)?.label ?? type;
  const featureLabels = features.map((f) => estimatorFeatures.find((e) => e.id === f)?.label).filter(Boolean);
  const withFeatures = featureLabels.length ? ` with: ${featureLabels.join(', ')}` : '';
  const summary = `${typeLabel}${withFeatures}. ৳${formatBdtK(r.low)} to ৳${formatBdtK(r.high)}, ${r.weeks[0]} to ${r.weeks[1]} weeks.`;
  return {
    projectType,
    source,
    estimate: summary,
    message: `We want to build a ${typeLabel}${withFeatures}.\n\n`,
  };
}

const channels = [
  { icon: MessageCircle, label: 'WhatsApp', value: site.phoneDisplay, href: site.whatsapp, external: true },
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: null, label: 'LinkedIn', value: '@shafacodedotcom', href: site.social.linkedin, external: true },
  {
    icon: MapPin,
    label: 'Office',
    value: `${site.address.locality}, ${site.address.country}`,
    href: 'https://www.google.com/maps/search/?api=1&query=Barishal%2C%20Bangladesh',
    external: true,
  },
] as const;

/** Contact. Figma: Contact 51:7454 (mobile 53:16335) */
export default async function ContactPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const prefill = prefillFrom(await searchParams);

  const ld: WithContext<ContactPageLd> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${site.name}`,
    url: absoluteUrl('/contact'),
  };

  return (
    <>
      <JsonLd data={[ld, professionalServiceLd()]} />
      <PageHero
        crumbs={[{ name: 'Contact', path: '/contact' }]}
        eyebrow="Contact"
        title={
          <>
            Tell us what you <Accent>want to build</Accent>
          </>
        }
        lede="Share your idea, goals, timeline and budget range. We review every request and reply with clear next steps, usually within 12 hours."
      />

      <div className="container-page grid gap-10 pb-section xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-grid">
        <ContactForm prefill={prefill} />

        <aside aria-labelledby="direct-title" className="flex flex-col gap-3">
          <h2 id="direct-title" className="type-h5 text-fg">
            Prefer a direct conversation?
          </h2>
          <ul className="flex flex-col gap-3">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...('external' in c && c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group card-focus flex items-center gap-4 rounded-md border border-line-subtle bg-surface-1 p-4 transition-colors hover:border-line-brand"
                >
                  <span className="grid size-9 shrink-0 place-items-center text-icon-brand">
                    {c.icon ? (
                      <c.icon className="size-5" strokeWidth={1.75} aria-hidden />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
                        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                      </svg>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="type-caption font-normal text-fg-subtle">{c.label}</span>
                    <span className="truncate type-label-sm text-fg">{c.value}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-icon transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 rounded-md border border-brand-soft-border bg-brand-soft p-4">
            <span className="type-stat text-fg-brand">12h</span>
            <span className="flex flex-col">
              <span className="type-label-sm text-fg">Typical response time</span>
              <span className="type-caption font-normal text-fg-subtle">For new project inquiries on business days.</span>
            </span>
          </div>
          <TimezoneOverlap />
        </aside>
      </div>

      <FaqSection
        className="border-t border-line-subtle"
        showContact={false}
        items={faqs}
        title={
          <>
            Before <Accent>you send</Accent>
          </>
        }
      />
    </>
  );
}
