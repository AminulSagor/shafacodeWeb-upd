import { getProjects } from '@/actions/projects/get-projects';
import CtaSection from '@/components/home/cta';
import Faq from '@/components/home/faq';
import HeroSection from '@/components/home/hero';
import Kickoff from '@/components/home/kickoff';
import Offer from '@/components/home/offer';
import PortfolioSection from '@/components/home/portfolio';
import PricingCta from '@/components/home/pricing-cta';
import Process from '@/components/home/process';
import TechStack from '@/components/home/tech-stack';
import Testimonials from '@/components/home/testimonials';
import ValueProps from '@/components/home/value-props';
import WhyChooseUs from '@/components/home/why-choose';

const Homepage = async () => {
  const projects = await getProjects();

  return (
    <main>
      <HeroSection />
      <ValueProps />
      <Offer />
      <PortfolioSection projects={projects} />
      <Process />
      <WhyChooseUs />
      <TechStack />
      <PricingCta />
      <Testimonials />
      <Faq />
      <Kickoff />
      <CtaSection />
    </main>
  );
};

export default Homepage;
