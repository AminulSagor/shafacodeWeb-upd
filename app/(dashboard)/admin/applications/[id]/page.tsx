import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { Check, Download, ExternalLink, FileText, Globe, Mail, MapPin, Phone } from 'lucide-react';

import { NotesPanel } from '@/components/admin/pipeline/notes-panel';
import { StageCard } from '@/components/admin/pipeline/stage-card';
import { PageHeader } from '@/components/admin/ui/page-header';
import { StageBadge } from '@/components/admin/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatDateYear, formatDate } from '@/lib/admin/format';
import { listNotes } from '@/lib/admin/notes';
import { getApplication, markViewed } from '@/lib/admin/pipeline';
import { stageLabel, type Application, type ApplicationStage } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';
import { experienceLabels } from '@/lib/schemas/application';
import { signedDownloadUrl } from '@/lib/storage';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Application' };

/** ISO to the datetime-local value in Dhaka time. */
function dhakaLocal(isoDate: string) {
  if (!isoDate) return '';
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(isoDate))
      .map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

const steps: { stage: ApplicationStage; label: string }[] = [
  { stage: 'new', label: 'Applied' },
  { stage: 'screening', label: 'Screening' },
  { stage: 'interview', label: 'Interview' },
  { stage: 'offer', label: 'Offer' },
  { stage: 'hired', label: 'Hired' },
];

function Stepper({ app }: { app: Application }) {
  const reached = app.stage === 'rejected' ? -1 : steps.findIndex((s) => s.stage === app.stage);
  return (
    <ol aria-label="Hiring stages" className="grid gap-2 rounded-md border border-line-subtle bg-surface-1 p-3 sm:grid-cols-5">
      {steps.map((s, i) => {
        const done = i < reached;
        const current = i === reached;
        const date = s.stage === 'new' ? app.createdAt : s.stage === 'interview' ? app.interviewAt || app.stageDates.interview : app.stageDates[s.stage];
        return (
          <li
            key={s.stage}
            aria-current={current ? 'step' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-field px-3 py-2.5',
              done && 'bg-surface-2',
              current && 'border border-action-primary-border bg-brand-soft'
            )}
          >
            <span
              aria-hidden
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-full type-label-xs',
                done || current ? 'bg-action-primary text-fg-on-brand' : 'border border-line text-fg-subtle'
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="type-label-sm text-fg">{s.label}</span>
              <span className="truncate type-caption font-normal text-fg-subtle">
                {done || current ? (date ? (s.stage === 'interview' ? formatDateTime(date) : formatDate(date)) : 'Done') : 'Pending'}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Application detail. Figma: 61:8290 (mobile 62:10325) */
export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) notFound();
  if (!app.isViewed) after(() => markViewed(app.id));

  const [notes, resumeHref] = await Promise.all([
    listNotes('apply-jobs', app.id),
    app.resume?.path ? signedDownloadUrl('resume', app.resume.path) : Promise.resolve(app.resume?.url ?? null),
  ]);
  const fileName = `${app.fullName.replace(/[^\w]+/g, '_')}_CV.pdf`;

  const contacts = [
    { icon: Mail, label: 'Email', value: app.email, href: `mailto:${app.email}` },
    app.phone && { icon: Phone, label: 'Phone', value: app.phone, href: `tel:${app.phone.replace(/[^\d+]/g, '')}` },
    app.linkedinUrl && { icon: ExternalLink, label: 'LinkedIn', value: app.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ''), href: app.linkedinUrl, external: true },
    app.portfolioUrl && { icon: Globe, label: 'Portfolio', value: app.portfolioUrl.replace(/^https?:\/\/(www\.)?/, ''), href: app.portfolioUrl, external: true },
    app.githubUrl && { icon: ExternalLink, label: 'GitHub', value: app.githubUrl.replace(/^https?:\/\/(www\.)?/, ''), href: app.githubUrl, external: true },
    app.location && { icon: MapPin, label: 'Location', value: app.location },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string; external?: boolean }[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {app.fullName}
            {app.stage === 'rejected' && <StageBadge stage="rejected" />}
          </span>
        }
        description={`Applied for ${app.jobTitle} · ${formatDateYear(app.createdAt)}`}
        actions={
          resumeHref && (
            <Button asChild variant="secondary">
              <a href={resumeHref} download={fileName}>
                <Download aria-hidden /> Download CV
              </a>
            </Button>
          )
        }
      />
      <Stepper app={app} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_--spacing(95)]">
        <div className="flex min-w-0 flex-col gap-4">
          <section aria-labelledby="resume-title" className="rounded-md border border-line-subtle bg-surface-1 p-5">
            <h2 id="resume-title" className="type-h5 text-fg">
              Resume
            </h2>
            <p className="mt-1 type-caption font-normal text-fg-subtle">
              {!app.resume ? 'No file attached.' : app.resume.path ? 'Stored privately. Links expire after 10 minutes.' : 'Stored in the old public bucket.'}
            </p>
            {resumeHref ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-field bg-surface-2 p-3">
                  <FileText className="size-5 text-icon" aria-hidden />
                  <span className="min-w-0 flex-1 truncate type-label-sm text-fg">{fileName}</span>
                  <Button asChild variant="ghost" size="sm">
                    <a href={resumeHref} target="_blank" rel="noopener noreferrer">
                      <ExternalLink aria-hidden /> Open
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <a href={resumeHref} download={fileName}>
                      <Download aria-hidden /> Download
                    </a>
                  </Button>
                </div>
                <iframe src={resumeHref} title={`Resume of ${app.fullName}`} className="mt-4 h-160 w-full rounded-field border border-line-subtle bg-surface-2" />
              </>
            ) : (
              <p className="mt-4 rounded-field bg-surface-2 p-4 type-body-sm text-fg-muted">
                {app.resume ? 'The resume is stored, but file storage is not configured on this server.' : 'No resume was attached.'}
              </p>
            )}
          </section>
          <section aria-labelledby="letter-title" className="rounded-md border border-line-subtle bg-surface-1 p-5">
            <h2 id="letter-title" className="type-h5 text-fg">
              Cover letter
            </h2>
            <p className="mt-3 type-body whitespace-pre-line text-fg">{app.whyUs || 'No cover letter.'}</p>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <section aria-labelledby="candidate-title" className="rounded-md border border-line-subtle bg-surface-1 p-5">
            <h2 id="candidate-title" className="type-h5 text-fg">
              Candidate
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {contacts.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-field bg-surface-2 text-icon">
                    <c.icon className="size-4" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="type-caption font-normal text-fg-subtle">{c.label}</span>
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="truncate rounded-sm type-label-sm text-fg-brand hover:underline focus-visible:focus-ring"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <span className="truncate type-label-sm text-fg">{c.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line-subtle pt-4">
              <div>
                <dt className="type-caption font-normal text-fg-subtle">Experience</dt>
                <dd className="type-label-sm text-fg">{experienceLabels[app.experienceRange as keyof typeof experienceLabels] ?? (app.experienceRange || 'Not given')}</dd>
              </div>
              <div>
                <dt className="type-caption font-normal text-fg-subtle">Framework</dt>
                <dd className="type-label-sm text-fg">{app.primaryFramework || 'Not given'}</dd>
              </div>
            </dl>
          </section>
          <StageCard key={`${app.stage}-${app.interviewAt}`} id={app.id} stage={app.stage} interviewLocal={dhakaLocal(app.interviewAt)} />
          <section aria-labelledby="notes-title" className="rounded-md border border-line-subtle bg-surface-1 p-5">
            <h2 id="notes-title" className="type-h5 text-fg">
              Team notes
            </h2>
            <p className="mt-1 mb-4 type-caption font-normal text-fg-subtle">Only visible to admins. Current stage: {stageLabel[app.stage]}.</p>
            <NotesPanel kind="application" id={app.id} notes={notes} label="Add a note" />
          </section>
        </div>
      </div>
    </div>
  );
}
