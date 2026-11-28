import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { WebPage, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PartnerForm } from '@/components/site/affiliate/partner-form';
import { PartnerVideo } from '@/components/site/affiliate/partner-video';
import { CommissionCalculator } from '@/components/site/interactive/commission-calculator';
import { JsonLd } from '@/components/site/json-ld';
import { FaqSection } from '@/components/site/sections/faq-section';
import { LifecycleSteps } from '@/components/site/sections/lifecycle-steps';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { partnerPoints, partnerSteps } from '@/content/affiliate';
import { partnerFaqs } from '@/content/faq';
import { site } from '@/content/site';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Partner program: earn 4 to 6% commission',
  description:
    'Refer software, website, app or IoT projects to ShafaCode and earn 4 to 6% commission when the project starts. Paid by bank or bKash.',
  path: '/affiliate',
});

/** Affiliate (partner program). Figma: Affiliate 52:8354 (mobile 53:17217) */
export default function AffiliatePage() {
  const ld: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${site.name} partner program`,
    url: absoluteUrl('/affiliate'),
    description: 'Refer projects to ShafaCode and earn 4 to 6% commission.',
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ name: 'Partner program', path: '/affiliate' }]}
        eyebrow="Partner program"
        title={
          <>
            Refer projects. Earn <Accent>4 to 6% commission.</Accent>
          </>
        }
        lede="Refer software, website, app or IoT projects to ShafaCode and earn commission when the project successfully starts."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="#join">
                Join as a partner <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </>
        }
      />

      <section id="how-it-works" aria-labelledby="steps-title" className="scroll-mt-nav-offset pb-section">
        <div className="container-page">
          <SectionHeader
            id="steps-title"
            eyebrow="How it works"
            title={
              <>
                Four steps from <Accent>intro to payout</Accent>
              </>
            }
          />
          <div className="mt-section-head">
            <LifecycleSteps steps={partnerSteps} columns={4} />
          </div>
        </div>
      </section>

      <section aria-labelledby="earnings-title" className="bg-surface-1 section-y">
        <div className="container-page grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,--spacing(140))] xl:gap-14">
          <div>
            <Eyebrow>Transparent earnings</Eyebrow>
            <h2 id="earnings-title" className="mt-5 type-h2 text-fg">
              See what <Accent>one referral</Accent> is worth
            </h2>
            <p className="mt-5 type-body-lg text-fg-muted">
              A straightforward structure that rewards you fairly for connecting us with quality projects. Example: a
              ৳200,000 project earns you ৳8,000 to ৳12,000.
            </p>
          </div>
          <CommissionCalculator />
        </div>
      </section>

      <section aria-labelledby="video-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="video-title"
            eyebrow="Watch"
            title={
              <>
                The program in <Accent>two minutes</Accent>
              </>
            }
            lede="Available in English and Bangla. The video loads only when you press play."
            ledeBelow
          />
          <div className="mt-section-head grid items-start gap-grid xl:grid-cols-[minmax(0,--spacing(194))_minmax(0,1fr)]">
            <PartnerVideo />
            <div className="rounded-md border border-line-subtle bg-surface-1 p-card md:p-6 xl:mt-12">
              <h3 className="type-h5 text-fg">In short</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {partnerPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 type-body-sm text-fg-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-icon-brand" strokeWidth={2.5} aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="join" aria-labelledby="join-title" className="scroll-mt-nav-offset bg-surface-1 section-y">
        <div className="container-page grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,--spacing(140))] xl:gap-14">
          <div className="xl:pt-6">
            <h2 id="join-title" className="type-h2 text-fg">
              Join the <Accent>partner network</Accent>
            </h2>
            <p className="mt-5 type-body-lg text-fg-muted">
              Fill out the form and we will send your partner kit within one business day.
            </p>
          </div>
          <PartnerForm />
        </div>
      </section>

      <FaqSection
        items={partnerFaqs}
        title={
          <>
            Partner <Accent>questions</Accent>
          </>
        }
      />
    </>
  );
}
