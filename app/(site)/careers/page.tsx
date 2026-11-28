import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { chipClassName } from '@/components/ui/chip-styles';
import { Input } from '@/components/ui/input';
import { FeatureCard } from '@/components/site/cards/feature-card';
import { JobRow } from '@/components/site/cards/job-row';
import { CtaBand } from '@/components/site/sections/cta-band';
import { LifecycleSteps } from '@/components/site/sections/lifecycle-steps';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { departmentLabel, hiringSteps, perks } from '@/content/careers';
import { site } from '@/content/site';
import { getJobs } from '@/lib/data/jobs';
import { buildMetadata } from '@/lib/seo';
import { first, type RawSearchParams } from '@/lib/search-params';

type SearchParams = Promise<RawSearchParams>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const p = await searchParams;
  return buildMetadata({
    title: 'Careers: open roles at ShafaCode',
    description:
      'Join a growing team of designers, developers and innovators in Barishal, Bangladesh, working on real products for real businesses. Remote-friendly.',
    path: '/careers',
    canonical: '/careers',
    noIndex: Boolean(first(p.department) || first(p.q)),
  });
}

/** Careers. Figma: Careers 49:6371 (mobile 53:15152) */
export default async function CareersPage({ searchParams }: { searchParams: SearchParams }) {
  const p = await searchParams;
  const department = first(p.department);
  const q = first(p.q)?.slice(0, 80);
  const jobs = await getJobs();

  const counts = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.department] = (acc[j.department] ?? 0) + 1;
    return acc;
  }, {});
  const departments = Object.keys(counts);
  const needle = q?.toLowerCase();
  const filtered = jobs.filter(
    (j) =>
      (!department || j.department === department) &&
      (!needle || `${j.title} ${j.summary} ${j.workMode}`.toLowerCase().includes(needle))
  );
  const groups = departments
    .map((d) => ({ department: d, jobs: filtered.filter((j) => j.department === d) }))
    .filter((g) => g.jobs.length > 0);

  const href = (patch: { department?: string; q?: string }) => {
    const n = { department, q, ...patch };
    const s = new URLSearchParams();
    if (n.department) s.set('department', n.department);
    if (n.q) s.set('q', n.q);
    const qs = s.toString();
    return qs ? `/careers?${qs}#open-positions` : '/careers#open-positions';
  };

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Careers', path: '/careers' }]}
        eyebrow={`Careers · ${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'}`}
        title={
          <>
            Build <Accent>your future</Accent> with ShafaCode
          </>
        }
        lede="Join a growing team of designers, developers and innovators working on real products for real businesses."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="#open-positions">
                View open positions <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#culture">Discover our culture</Link>
            </Button>
          </>
        }
      />

      <div className="container-page">
        <div className="relative aspect-4/3 overflow-hidden rounded-card bg-surface-1 md:aspect-1240/460">
          <Image
            src="/images/careers/team-culture.jpg"
            alt="Two ShafaCode developers laughing at a code review while teammates talk in the bright studio behind them"
            fill
            preload
            sizes="(min-width: 1340px) 1240px, 92vw"
            className="object-cover"
          />
        </div>
      </div>

      <section id="culture" aria-labelledby="culture-title" className="scroll-mt-nav-offset section-y">
        <div className="container-page">
          <SectionHeader
            id="culture-title"
            eyebrow="Why work with us"
            title={
              <>
                Elevate your craft in an environment <Accent>built for excellence</Accent>
              </>
            }
          />
          <ul className="mt-section-head grid gap-grid md:grid-cols-2 xl:grid-cols-3">
            {perks.map((perk) => (
              <li key={perk.title}>
                <FeatureCard icon={perk.icon} title={perk.title} body={perk.body} className="bg-surface-1" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="open-positions" aria-labelledby="positions-title" className="scroll-mt-nav-offset bg-surface-1 section-y">
        <div className="container-page flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="positions-title" className="type-h2 text-fg">
              Open <Accent>positions</Accent>
            </h2>
            <form action="/careers#open-positions" method="get" role="search" className="relative w-full md:w-80">
              {department && <input type="hidden" name="department" value={department} />}
              <label htmlFor="role-search" className="sr-only">
                Search roles
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-icon" aria-hidden />
              <Input key={q ?? ''} id="role-search" name="q" type="search" defaultValue={q} placeholder="Search roles…" className="pl-10" />
            </form>
          </div>

          {departments.length > 1 && (
            <nav aria-label="Departments" className="-mx-page overflow-x-auto px-page md:mx-0 md:overflow-visible md:px-0">
              <ul className="flex w-max gap-2 py-1 md:w-auto md:flex-wrap">
                <li>
                  <Link href={href({ department: undefined })} aria-current={!department ? 'page' : undefined} className={chipClassName(!department)}>
                    All <span className={cn('type-mono-xs', !department ? 'text-fg-on-brand' : 'text-fg-subtle')}>{jobs.length}</span>
                  </Link>
                </li>
                {departments.map((d) => (
                  <li key={d}>
                    <Link href={href({ department: d })} aria-current={department === d ? 'page' : undefined} className={chipClassName(department === d)}>
                      {departmentLabel(d)}{' '}
                      <span className={cn('type-mono-xs', department === d ? 'text-fg-on-brand' : 'text-fg-subtle')}>{counts[d]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {groups.length > 0 ? (
            <div className="flex flex-col gap-8">
              {groups.map((g) => (
                <section key={g.department} aria-labelledby={`dept-${g.department}`}>
                  <h3 id={`dept-${g.department}`} className="type-h5 text-fg">
                    {departmentLabel(g.department)}
                  </h3>
                  <ul className="mt-2">
                    {g.jobs.map((j) => (
                      <li key={j.slug}>
                        <JobRow job={j} headingLevel="h4" />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-line-subtle p-8 text-center">
              <p className="type-h4 text-fg">{jobs.length === 0 ? 'No open roles right now.' : 'No roles match that search.'}</p>
              <p className="mt-2 type-body-sm text-fg-muted">
                We still like hearing from great people. Send your CV and a short note to{' '}
                <a href={`mailto:${site.email}?subject=Open%20application`} className="rounded-sm text-fg-brand underline underline-offset-4 focus-visible:focus-ring">
                  {site.email}
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="hiring-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="hiring-title"
            eyebrow="Hiring process"
            title={
              <>
                A transparent journey, <Accent>start to offer</Accent>
              </>
            }
            lede="Six steps, usually two to three weeks. You always know where you stand."
          />
          <div className="mt-section-head">
            <LifecycleSteps steps={hiringSteps} />
          </div>
        </div>
      </section>

      <CtaBand showSteps={false} />
    </>
  );
}
