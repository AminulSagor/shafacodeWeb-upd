import { getProjects } from '@/actions/projects/get-projects';
import CtaSection from '@/components/home/cta';
import HeroSection from '@/components/home/hero';
import Offer from '@/components/home/offer';
import PortfolioSection from '@/components/home/portfolio';
import TechStack from '@/components/home/tech-stack';
import WhyChooseUs from '@/components/home/why-choose';

const Homepage = async () => {
  const projects = await getProjects();
  const delivered = projects.filter(
    (item) => item.status === 'delivered'
  ).length;
  const inprogress = projects.filter(
    (item) => item.status === 'in-progress'
  ).length;

  return (
    <>
      <HeroSection delivered={delivered} inprogress={inprogress} />
      <TechStack />
      <PortfolioSection />
      <Offer />
      <WhyChooseUs />
      <CtaSection />
    </>
  );
};

export default Homepage;
