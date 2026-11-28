import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { JobPosting, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { JobRow, jobHref } from '@/components/site/cards/job-row';
import { ShareRoleButton } from '@/components/site/careers/share-role-button';
import { JsonLd } from '@/components/site/json-ld';
import { Markdown } from '@/components/site/markdown';
import { PageHero } from '@/components/site/sections/page-hero';
import { departmentLabel } from '@/content/careers';
import { site } from '@/content/site';
import { getJob, getJobs } from '@/lib/data/jobs';
import { formatIso } from '@/lib/dates';
import { markdownToHtml } from '@/lib/markdown';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

/** Prerender the open roles; any other slug renders on demand (and 404s when closed). */
export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: 'Role not found', robots: { index: false, follow: true } };
  return buildMetadata({
    title: `${job.title}: ${departmentLabel(job.department)} role`,
    description: job.summary || `${job.title} at ${site.name}, ${job.workMode.toLowerCase()}.`,
    path: jobHref(job.slug),
  });
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Job detail. Figma: Job Detail 49:6823 (mobile 53:15501). Closed or missing roles are a 404. */
export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  const others = (await getJobs()).filter((j) => j.slug !== job.slug).slice(0, 3);
  const url = absoluteUrl(jobHref(job.slug));
  const applyHref = `${jobHref(job.slug)}/apply`;
  // TELECOMMUTE only for fully remote roles; hybrid roles keep the office location only.
  const remote = job.workMode.trim().toLowerCase() === 'remote';
  const posted = formatIso(dateFmt, job.postedAt);
  const applyBy = formatIso(dateFmt, job.validThrough);

  const facts = [
    job.employmentType,
    job.location ?? job.workMode,
    job.salary,
    posted && `Posted ${posted}`,
    applyBy && `Apply by ${applyBy}`,
  ].filter(Boolean) as string[];

  const employmentType: Record<string, string> = {
    'Full-time': 'FULL_TIME',
    'Part-time': 'PART_TIME',
    Contract: 'CONTRACTOR',
    Internship: 'INTERN',
  };

  const ld: WithContext<JobPosting> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: await markdownToHtml(job.description || job.summary),
    ...(job.postedAt ? { datePosted: job.postedAt } : {}),
    validThrough: job.validThrough,
    employmentType: employmentType[job.employmentType] ?? 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: site.name, sameAs: site.url, logo: absoluteUrl('/icon.png') },
    directApply: true,
    url,
    // Remote roles add TELECOMMUTE; the office address stays as the job location.
    ...(remote
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: (job.applicantCountries?.length ? job.applicantCountries : [site.address.countryCode]).map(
            (code) => ({ '@type': 'Country' as const, name: code })
          ),
        }
      : {}),
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.address.locality,
        addressCountry: site.address.countryCode,
      },
    },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[
          { name: 'Careers', path: '/careers' },
          { name: job.title.replace(/\s*\(.*\)\s*$/, ''), path: jobHref(job.slug) },
        ]}
        eyebrow={`${departmentLabel(job.department)} · ${job.workMode}`}
        title={
          job.headline ? (
            <>
              {job.headline.before} <Accent>{job.headline.accent}</Accent> {job.headline.after}
            </>
          ) : (
            job.title
          )
        }
        lede={job.summary}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={applyHref}>
                Apply for this role <ArrowRight aria-hidden />
              </Link>
            </Button>
            <ShareRoleButton url={url} title={job.title} variant="secondary" size="lg" />
          </>
        }
      />

      <div className="container-page">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 type-mono-xs text-fg-subtle" aria-label="Role facts">
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="container-page grid gap-10 pt-10 pb-section xl:grid-cols-[minmax(0,1fr)_--spacing(105)] xl:gap-grid xl:pt-14">
        <div className="min-w-0 xl:max-w-180 [&_h2]:type-h3">
          <Markdown lists="checks">{job.description}</Markdown>
        </div>
        <aside aria-labelledby="ready-title" className="xl:sticky xl:top-sticky xl:self-start">
          <div className="rounded-md border border-line-subtle bg-surface-1 p-6">
            <h2 id="ready-title" className="type-h4 text-fg">
              Ready to build?
            </h2>
            <p className="mt-2 type-body-sm text-fg-muted">
              Takes about 5 minutes. We reply to every application within 48 hours.
            </p>
            <dl className="mt-5 flex flex-col">
              {[
                ['Team', job.team],
                ['Reports to', job.reportsTo],
                ['Process', '6 steps · 2 to 3 weeks'],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-t border-line-subtle py-2.5 type-body-sm">
                    <dt className="text-fg-subtle">{k}</dt>
                    <dd className="text-right font-medium text-fg">{v}</dd>
                  </div>
                ))}
            </dl>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href={applyHref}>
                Apply now <ArrowRight aria-hidden />
              </Link>
            </Button>
            <ShareRoleButton
              url={url}
              title={job.title}
              label="Share this role"
              variant="ghost"
              className="mt-2 w-full"
            />
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="more-roles-title" className="bg-surface-1 section-y">
          <div className="container-page">
            <div className="max-w-205">
              <h2 id="more-roles-title" className="type-h3 text-fg">
                More open roles
              </h2>
              <ul className="mt-4">
                {others.map((j) => (
                  <li key={j.slug}>
                    <JobRow job={j} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
