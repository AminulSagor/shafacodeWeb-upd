import type { Metadata } from 'next';

import { Accent } from '@/components/ui/accent';
import { JsonLd } from '@/components/site/json-ld';
import { CtaBand } from '@/components/site/sections/cta-band';
import { FaqSection } from '@/components/site/sections/faq-section';
import { HomeHero } from '@/components/site/home/hero';
import { ClientLogos } from '@/components/site/home/client-logos';
import { WhyBento } from '@/components/site/home/why-bento';
import { ServicesIndex } from '@/components/site/home/services-index';
import { FeaturedWork } from '@/components/site/home/featured-work';
import { ProcessSection } from '@/components/site/home/process-section';
import { Principles } from '@/components/site/home/principles';
import { TechGrid } from '@/components/site/home/tech-grid';
import { PricingTeaser } from '@/components/site/home/pricing-teaser';
import { Testimonials } from '@/components/site/home/testimonials';
import { VideoStories } from '@/components/site/home/video-stories';
import { WorkAnywhere } from '@/components/site/home/work-anywhere';
import { homeFaqs } from '@/content/faq';
import { textTestimonials, videoStories } from '@/content/testimonials';
import { getFeaturedCaseStudies } from '@/lib/data/case-studies';
import { buildMetadata } from '@/lib/seo';
import { organizationLd, professionalServiceLd, websiteLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'ShafaCode: transparent software partner for growing teams',
    description:
      'Websites, web apps, mobile apps, SaaS, custom software and IoT from Barishal, Bangladesh. Clear milestones, weekly demos and scalable engineering.',
    path: '/',
  }),
  title: { absolute: 'ShafaCode: transparent software partner for growing teams' },
};

/** Home. Figma: Home 24:2397 (mobile 53:11850, tablet 53:20551) */
export default async function HomePage() {
  const caseStudies = await getFeaturedCaseStudies();

  return (
    <>
      <JsonLd data={[organizationLd(), professionalServiceLd(), websiteLd()]} />
      <HomeHero />
      <ClientLogos />
      <WhyBento />
      <ServicesIndex />
      <FeaturedWork items={caseStudies} />
      <ProcessSection />
      <Principles />
      <TechGrid />
      <PricingTeaser />
      <Testimonials items={textTestimonials} />
      <VideoStories items={videoStories} />
      <FaqSection
        items={homeFaqs}
        title={
          <>
            Common questions <Accent>before starting</Accent> a project
          </>
        }
      />
      <WorkAnywhere />
      <CtaBand />
    </>
  );
}
