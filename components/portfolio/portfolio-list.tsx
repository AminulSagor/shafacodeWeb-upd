'use client';

import { useState } from 'react';
import { Check, Hourglass, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PortfolioItem = {
  id: string;
  title?: string;
  description?: string;
  client?: string;
  status?: string;
  contactEmail?: string;
};

const filters = [
  { key: 'all', label: 'All Projects' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'in-progress', label: 'Ongoing' },
] as const;

const PortfolioList = ({ projects }: { projects: PortfolioItem[] }) => {
  const [active, setActive] = useState<(typeof filters)[number]['key']>('all');
  const visible = projects.filter(
    (p) => active === 'all' || p.status === active
  );

  return (
    <>
      <div className="border-y border-white/5 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              aria-pressed={active === f.key}
              className={cn(
                'rounded-full border px-5 py-2 text-sm transition-colors',
                active === f.key
                  ? 'border-brand bg-brand font-semibold text-black'
                  : 'border-white/15 text-slate-200 hover:border-brand/50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
        {visible.map((p) => {
          const delivered = p.status === 'delivered';
          const contact = p.contactEmail ?? '';
          return (
            <article
              key={p.id}
              className="flex flex-col rounded-3xl border border-brand/30 bg-gradient-to-b from-[#8cb82e] to-[#2b3a10] p-5 transition-transform hover:-translate-y-1"
            >
              <div className="relative grid h-40 place-items-center rounded-2xl bg-black/30">
                <span
                  className={cn(
                    'absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs',
                    delivered
                      ? 'border-brand/60 bg-black/50 text-brand'
                      : 'border-white/20 bg-black/50 text-slate-200'
                  )}
                >
                  {delivered ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Hourglass className="h-3 w-3" />
                  )}
                  {delivered ? 'Delivered' : 'Ongoing'}
                </span>
                <span className="text-5xl font-semibold text-white/15">
                  {(p.title ?? '?').charAt(0)}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-medium">{p.title}</h3>
              {p.client && (
                <p className="mt-1 text-sm text-slate-200/80">{p.client}</p>
              )}
              <p className="mt-4 line-clamp-4 flex-1 border-t border-white/15 pt-4 text-sm text-slate-100/90">
                {p.description}
              </p>
              {contact && (
                <a
                  href={contact.includes('@') ? `mailto:${contact}` : contact}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {contact.includes('@') ? 'Contact via email' : 'Facebook'}
                </a>
              )}
            </article>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-400">
            No projects in this category yet.
          </p>
        )}
      </div>
    </>
  );
};

export default PortfolioList;
