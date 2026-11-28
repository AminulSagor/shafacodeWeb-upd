import type { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Calendar, Check, Download, Eye, FileText, Inbox } from 'lucide-react';

import { deleteRecord } from '@/actions/admin/pipeline';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { Person } from '@/components/admin/dashboard/person';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { UrlSelect } from '@/components/admin/table/url-select';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { StageBadge } from '@/components/admin/ui/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/admin/format';
import { matches, paginate, readListQuery, sortBy } from '@/lib/admin/list';
import { listApplications } from '@/lib/admin/pipeline';
import { applicationStages, stageLabel, type Application } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';
import type { RawSearchParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Applications' };

const BASE = '/admin/applications';
const sorters: Record<string, (a: Application) => string | number> = {
  candidate: (a) => a.fullName.toLowerCase(),
  role: (a) => a.jobTitle.toLowerCase(),
  stage: (a) => applicationStages.indexOf(a.stage),
  applied: (a) => a.createdAt,
};

function sinceMonday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString();
}

/** Applications. Figma: 61:7711 */
export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listApplications();
  const stage = query.get('stage');
  const role = query.get('role');
  const filtered = all.filter(
    (a) => (!stage || a.stage === stage) && (!role || a.jobSlug === role) && matches(query.q, a.fullName, a.email, a.jobTitle)
  );
  const page = paginate(query.sort && sorters[query.sort] ? sortBy(filtered, sorters[query.sort], query.dir) : filtered, query.page);
  const roles = [...new Map(all.map((a) => [a.jobSlug, a.jobTitle])).entries()].filter(([slug]) => slug).sort((x, y) => x[1].localeCompare(y[1]));
  const count = (s: string) => all.filter((a) => a.stage === s).length;
  const monday = sinceMonday();

  const columns: Column<Application>[] = [
    { key: 'candidate', header: 'Candidate', sortable: true, primary: true, cell: (a) => <Person name={a.fullName} sub={a.email} href={`${BASE}/${a.id}`} /> },
    { key: 'role', header: 'Role', sortable: true, cell: (a) => <span className="text-fg">{a.jobTitle}</span> },
    {
      key: 'stage',
      header: 'Stage',
      sortable: true,
      cell: (a) => (
        <span className="flex items-center gap-2">
          <StageBadge stage={a.stage} />
          {!a.isViewed && <span className="type-caption text-fg-brand">Unread</span>}
        </span>
      ),
    },
    { key: 'applied', header: 'Applied', sortable: true, cell: (a) => <time dateTime={a.createdAt} className="text-fg">{formatDate(a.createdAt)}</time> },
    {
      key: 'resume',
      header: 'Resume',
      cell: (a) =>
        a.resume ? (
          <span className="inline-flex items-center gap-1.5 text-fg">
            <FileText className="size-4 text-icon" aria-hidden /> PDF
          </span>
        ) : (
          <span className="text-fg-subtle">None</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Applications"
        description="Candidates for every open role. Resumes are private and open through short-lived links."
        actions={
          <>
            <Button asChild variant="secondary">
              <a href="/admin/export/applications" download>
                <Download aria-hidden /> Export CSV
              </a>
            </Button>
            <Button asChild>
              <Link href="/admin/jobs">
                <Briefcase aria-hidden /> Open roles
              </Link>
            </Button>
          </>
        }
      />
      <section aria-label="Application numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="New" value={count('new')} icon={Inbox} delta={`+${all.filter((a) => a.createdAt >= monday).length}`} note="since Monday" />
        <KpiCard label="In review" value={count('screening')} icon={Eye} />
        <KpiCard label="Interviews" value={count('interview')} icon={Calendar} />
        <KpiCard label="Hired" value={count('hired')} icon={Check} />
      </section>

      <section aria-label="Applications" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs
          base={BASE}
          query={query}
          param="stage"
          tabs={[{ label: 'All', count: all.length }, ...applicationStages.map((s) => ({ value: s, label: stageLabel[s], count: count(s) }))]}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search applications" placeholder="Search name or email…" />
          <UrlSelect param="role" label="Role" allLabel="All roles" options={roles.map(([value, label]) => ({ value, label }))} className="w-full md:w-60" />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(a) => a.id}
          base={BASE}
          query={query}
          caption="Job applications"
          empty={
            <>
              <p className="type-h5 text-fg">No applications match</p>
              <p className="mt-1 type-body-sm text-fg-muted">Applications from the careers pages appear here.</p>
            </>
          }
          actions={(a) => (
            <>
              <RowLink href={`${BASE}/${a.id}`} label={`Open ${a.fullName}`}>
                <Eye aria-hidden />
              </RowLink>
              <ConfirmDelete
                label={`Delete the application from ${a.fullName}`}
                title="Delete this application?"
                description={`The application from ${a.fullName} and its notes are removed for good. The resume file stays in storage.`}
                action={deleteRecord.bind(null, 'application', a.id)}
              />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="applications" />
      </section>
    </div>
  );
}
