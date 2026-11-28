import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { jobHref } from '@/components/site/cards/job-row';
import { ApplyForm } from '@/components/site/careers/apply-form';
import { PageHero } from '@/components/site/sections/page-hero';
import { nextSteps } from '@/content/careers';
import { getJob, getJobs } from '@/lib/data/jobs';
import { buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: 'Role not found', robots: { index: false, follow: true } };
  return buildMetadata({
    title: `Apply: ${job.title}`,
    description: `Apply for ${job.title} at ShafaCode. Takes about 5 minutes.`,
    path: `${jobHref(job.slug)}/apply`,
    noIndex: true,
  });
}

/** Job application. Figma: Job Apply 50:6935 (mobile 53:15748). noindex, follow. */
export default async function ApplyPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  const shortTitle = job.title.replace(/\s*\(.*\)\s*$/, '');

  const highlights = [
    [job.employmentType, job.team && job.team.toLowerCase()].filter(Boolean).join(' · '),
    job.location ?? job.workMode,
    job.salary && `${job.salary} plus benefits`,
  ].filter(Boolean) as string[];

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Careers', path: '/careers' },
          { name: shortTitle, path: jobHref(job.slug) },
          { name: 'Apply', path: `${jobHref(job.slug)}/apply` },
        ]}
        eyebrow={`Application · ${shortTitle}`}
        title={
          <>
            Apply for <Accent>{shortTitle}</Accent>
          </>
        }
        lede="Takes about 5 minutes. We read every application and reply within 48 hours."
      />

      <div className="container-page grid gap-10 pb-section xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-grid">
        <ApplyForm jobSlug={job.slug} jobTitle={shortTitle} />

        <aside aria-label="About this role" className="flex flex-col gap-4 xl:sticky xl:top-sticky xl:self-start">
          <section aria-labelledby="highlights-title" className="rounded-md border border-line-subtle bg-surface-1 p-5">
            <h2 id="highlights-title" className="type-h5 text-fg">
              Role highlights
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 type-body-sm text-fg-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-icon-brand" strokeWidth={2.5} aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="next-title" className="rounded-md border border-brand-soft-border bg-brand-soft p-5">
            <h2 id="next-title" className="type-h5 text-fg">
              What happens next
            </h2>
            <ol className="mt-3 flex flex-col gap-3">
              {nextSteps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-3">
                  <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-action-primary type-label-xs text-fg-on-brand">
                    {i + 1}
                  </span>
                  <span className="flex flex-col">
                    <span className="type-label-sm text-fg">{s.title}</span>
                    <span className="type-caption font-normal text-fg-subtle">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}
