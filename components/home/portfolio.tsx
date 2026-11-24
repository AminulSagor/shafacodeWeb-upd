import Link from 'next/link';
import { ArrowRight, FolderOpen } from 'lucide-react';
import PortfolioCard from './showcase-card';
import type { Project } from '@/actions/projects/get-projects';

const PortfolioSection = ({ projects }: { projects: Project[] }) => {
  // Delivered work first, then the rest; the home page shows six at most.
  const featured = [...projects]
    .sort(
      (a, b) =>
        Number(b.status === 'delivered') - Number(a.status === 'delivered')
    )
    .slice(0, 6);

  return (
    <section
      id="portfolio"
      className="scroll-mt-20 bg-[linear-gradient(to_bottom,transparent,rgba(60,90,10,0.35)_80%,transparent)] px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-4 py-1.5 text-xs text-brand">
            <FolderOpen className="h-3.5 w-3.5" />
            Featured Showcases
          </span>
          <h2 className="mt-5 text-4xl font-medium sm:text-5xl">
            Recent Work That Shows How We Think
          </h2>
          <p className="mt-4 text-slate-300">
            Explore how we turn client problems into usable, scalable, and
            business-ready digital products.
          </p>
        </div>

        {featured.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <PortfolioCard
                key={project.id}
                title={project.title}
                client={project.client}
              />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-slate-400">
            Our case studies are on the way.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90"
          >
            <ArrowRight className="h-4 w-4" />
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
