import { getProjects } from '@/actions/projects/get-projects';
import PortfolioHero from '@/components/portfolio/portfolio-hero';
import PortfolioList from '@/components/portfolio/portfolio-list';

const PortfolioPage = async () => {
  const projects = await getProjects();
  const delivered = projects.filter((p) => p.status === 'delivered').length;
  const onprogress = projects.filter((p) => p.status === 'in-progress').length;

  return (
    <main>
      <PortfolioHero delivered={delivered} onprogress={onprogress} />
      <PortfolioList projects={projects} />
    </main>
  );
};

export default PortfolioPage;
