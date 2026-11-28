import Link from 'next/link';

import { Panel } from '@/components/admin/ui/panel';
import { InquiryBadge, PublishBadge, StageBadge } from '@/components/admin/ui/status-badge';
import { budgetShort, formatDate, initials, projectTypeShort, relativeTime } from '@/lib/admin/format';
import type { ActivityEvent, Application, ContentItem, Inquiry } from '@/lib/admin/types';
import { Person } from './person';

const th = 'px-4 py-3 text-left type-mono-xs font-medium text-fg-subtle';
const td = 'px-4 py-3.5 align-middle';

export function RecentInquiries({ items }: { items: Inquiry[] }) {
  return (
    <Panel title="Recent inquiries" titleId="recent-inquiries" action={{ href: '/admin/inquiries', label: 'View all', srLabel: 'inquiries' }}>
      {items.length ? (
        <table className="w-full border-collapse type-body-sm">
          <thead className="bg-surface-2">
            <tr className="border-b border-line-subtle">
              <th scope="col" className={th}>Client</th>
              <th scope="col" className={`${th} max-sm:hidden`}>Type</th>
              <th scope="col" className={`${th} max-md:hidden`}>Budget</th>
              <th scope="col" className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="relative border-b border-line-subtle last:border-0 hover:bg-hover">
                <td className={td}>
                  <Person name={i.fullName} sub={i.company || i.email} href={`/admin/inquiries?id=${i.id}`} />
                  <p className="mt-1.5 ml-13 type-caption font-normal text-fg-muted sm:hidden">
                    {projectTypeShort(i.projectType)} · {budgetShort(i.budgetRange)}
                  </p>
                </td>
                <td className={`${td} text-fg max-sm:hidden`}>{projectTypeShort(i.projectType)}</td>
                <td className={`${td} text-fg tabular max-md:hidden`}>{budgetShort(i.budgetRange)}</td>
                <td className={td}>
                  <InquiryBadge status={i.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="px-5 py-8 text-center type-body-sm text-fg-subtle">No inquiries yet.</p>
      )}
    </Panel>
  );
}

export function LeadPipeline({ rows }: { rows: { label: string; value: number; href: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Panel title="Lead pipeline" titleId="lead-pipeline" bodyClassName="flex flex-col gap-4 px-5 py-5">
      {rows.map((r) => (
        <Link key={r.label} href={r.href} className="group flex flex-col gap-1.5 rounded-sm focus-visible:focus-ring">
          <span className="flex items-center justify-between type-body-sm">
            <span className="text-fg-muted group-hover:text-fg">{r.label}</span>
            <span className="text-fg tabular">{r.value}</span>
          </span>
          <span aria-hidden className="h-1.5 overflow-hidden rounded-full bg-surface-3">
            <span className="block h-full rounded-full bg-action-primary" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
        </Link>
      ))}
    </Panel>
  );
}

const editHref = (c: ContentItem) => (c.kind === 'post' ? `/admin/blogs/${c.id}` : `/admin/case-studies/${c.id}`);
function contentMeta(c: ContentItem) {
  if (c.status === 'scheduled') return relativeTime(c.publishedAt);
  if (c.status === 'published') return formatDate(c.publishedAt);
  return `Edited ${relativeTime(c.updatedAt)}`;
}

export function ContentQueue({ items }: { items: ContentItem[] }) {
  return (
    <Panel title="Content queue" titleId="content-queue" action={{ href: '/admin/blogs', label: 'Open', srLabel: 'blog posts' }}>
      {items.length ? (
        <ul className="px-5">
          {items.map((c) => (
            <li key={c.id} className="relative flex items-center justify-between gap-3 border-b border-line-subtle py-3.5 last:border-0">
              <span className="flex min-w-0 flex-col">
                <Link href={editHref(c)} className="truncate rounded-sm type-label text-fg after:absolute after:inset-0 hover:underline focus-visible:focus-ring">
                  {c.kind === 'case-study' ? `Case study: ${c.title}` : c.title}
                </Link>
                <span className="type-caption font-normal text-fg-subtle">{contentMeta(c)}</span>
              </span>
              <PublishBadge status={c.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-8 text-center type-body-sm text-fg-subtle">Nothing waiting.</p>
      )}
    </Panel>
  );
}

export function RecentApplications({ items }: { items: Application[] }) {
  return (
    <Panel title="Recent applications" titleId="recent-applications" action={{ href: '/admin/applications', label: 'View all', srLabel: 'applications' }}>
      {items.length ? (
        <table className="w-full border-collapse type-body-sm">
          <thead className="bg-surface-2">
            <tr className="border-b border-line-subtle">
              <th scope="col" className={th}>Applicant</th>
              <th scope="col" className={`${th} max-sm:hidden`}>Role</th>
              <th scope="col" className={th}>Stage</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="relative border-b border-line-subtle last:border-0 hover:bg-hover">
                <td className={td}>
                  <Person name={a.fullName} sub={`Applied ${formatDate(a.createdAt)}`} href={`/admin/applications/${a.id}`} />
                  <p className="mt-1.5 ml-13 type-caption font-normal text-fg-muted sm:hidden">{a.jobTitle}</p>
                </td>
                <td className={`${td} text-fg max-sm:hidden`}>{a.jobTitle}</td>
                <td className={td}>
                  <StageBadge stage={a.stage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="px-5 py-8 text-center type-body-sm text-fg-subtle">No applications yet.</p>
      )}
    </Panel>
  );
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Panel title="Activity" titleId="activity" bodyClassName="px-5 py-5">
      {events.length ? (
        <ol className="flex flex-col gap-4">
          {events.map((e) => (
            <li key={e.id} className="flex items-start gap-2.5">
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-3 type-label-xs text-fg-muted">
                {initials(e.actor)}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="type-body-sm text-fg">
                  {e.actor} {e.text}
                </span>
                <time dateTime={e.at} className="type-caption font-normal text-fg-subtle">
                  {relativeTime(e.at)}
                </time>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-3 text-center type-body-sm text-fg-subtle">No activity yet.</p>
      )}
    </Panel>
  );
}
