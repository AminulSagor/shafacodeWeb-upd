import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';

type Props = {
  title?: string;
  client?: string;
  href?: string;
};

const PortfolioCard = ({ title, client, href = '/portfolio' }: Props) => {
  return (
    <article className="group flex flex-col rounded-3xl border border-brand/30 bg-gradient-to-b from-[#8cb82e] to-[#2b3a10] p-4 transition-transform duration-200 hover:-translate-y-1">
      <div className="grid aspect-[16/10] place-items-center rounded-2xl bg-black/20">
        <Building2 className="h-12 w-12 text-white/30" />
      </div>
      <div className="mt-5 flex-1 px-1">
        <p className="text-[11px] uppercase tracking-wider text-brand">
          Web / App
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-medium" title={title}>
          {title}
        </h3>
        {client && (
          <p className="mt-1 truncate text-xs font-medium text-brand">
            {client}
          </p>
        )}
      </div>
      <Link
        href={href}
        className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-black/10 py-3 text-sm font-medium transition-colors hover:bg-black/30"
      >
        <ArrowRight className="h-4 w-4" />
        View Case Study
      </Link>
    </article>
  );
};

export default PortfolioCard;
