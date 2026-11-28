import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { departmentLabel, type Job } from '@/content/careers';

export const jobHref = (slug: string) => `/careers/${slug}`;

export function jobMeta(job: Job) {
  return [departmentLabel(job.department), job.workMode, job.employmentType, job.salary].filter(Boolean) as string[];
}

/** One open role: title, mono meta, "View role". Whole row links. Figma: Job Row 18:2818 */
export function JobRow({ job, headingLevel: H = 'h3' }: { job: Job; headingLevel?: 'h3' | 'h4' }) {
  return (
    <article className="group card-focus relative flex items-center justify-between gap-6 rounded-sm border-b border-line-subtle px-2.5 py-5 transition-colors hover:bg-hover md:py-6">
      <div className="min-w-0">
        <H className="type-h5 text-fg">
          <Link href={jobHref(job.slug)} className="after:absolute after:inset-0">
            {job.title}
          </Link>
        </H>
        <ul className="mt-1.5 flex flex-wrap gap-x-2.5 type-mono-xs text-fg-subtle" aria-label="Role details">
          {jobMeta(job).map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <span aria-hidden className="inline-flex shrink-0 items-center gap-1.5 type-label-sm text-fg-muted group-hover:text-fg">
        <span className="max-sm:sr-only">View role</span>
        <ArrowUpRight className="size-4 shrink-0 transition-transform duration-(--duration-fast) motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
      </span>
    </article>
  );
}
