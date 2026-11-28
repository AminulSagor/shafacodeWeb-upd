import type { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, CircleCheck, ExternalLink, FileText, Pencil, Plus, Users } from 'lucide-react';

import { deleteJob } from '@/actions/admin/jobs';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { departmentLabel } from '@/content/careers';
import { dhakaDay, formatDate } from '@/lib/admin/format';
import { listJobsAdmin, type JobEdit } from '@/lib/admin/jobs';
import { matches, paginate, readListQuery, sortBy } from '@/lib/admin/list';
import { requireAdmin } from '@/lib/auth';
import { employmentLabel, jobStatuses, jobStatusLabel, workModeLabel } from '@/lib/schemas/admin/job';
import type { RawSearchParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Job Roles' };

const BASE = '/admin/jobs';
const tone = { draft: 'neutral', open: 'success', closed: 'danger' } as const;
const sorters: Record<string, (j: JobEdit) => string | number> = {
  title: (j) => j.title.toLowerCase(),
  applications: (j) => j.applications,
  valid: (j) => j.validThrough,
};

/** Job Roles. Figma: 59:7302 */
export default async function JobsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listJobsAdmin();
  const status = query.get('status');
  const filtered = all.filter((j) => (!status || j.status === status) && matches(query.q, j.title, j.department));
  const page = paginate(query.sort && sorters[query.sort] ? sortBy(filtered, sorters[query.sort], query.dir) : filtered, query.page);
  const count = (s: string) => all.filter((j) => j.status === s).length;
  const today = dhakaDay();

  const columns: Column<JobEdit>[] = [
    {
      key: 'title',
      header: 'Role',
      sortable: true,
      primary: true,
      cell: (j) => (
        <span className="flex min-w-0 flex-col">
          <Link href={`${BASE}/${j.id}`} className="truncate rounded-sm type-label text-fg after:absolute after:inset-0 hover:underline focus-visible:focus-ring">
            {j.title}
          </Link>
          <span className="truncate type-caption font-normal text-fg-subtle">
            {departmentLabel(j.department)} · {employmentLabel[j.employmentType]} · {workModeLabel[j.workMode]}
          </span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (j) => {
        const expired = j.status === 'open' && j.validThrough && j.validThrough < today;
        return (
          <Badge tone={expired ? 'warning' : tone[j.status]} dot>
            {expired ? 'Expired' : !j.acceptingApplications && j.status === 'open' ? 'Paused' : jobStatusLabel[j.status]}
          </Badge>
        );
      },
    },
    { key: 'applications', header: 'Applications', sortable: true, cell: (j) => <Link href={`/admin/applications?role=${j.slug}`} className="relative z-2 rounded-sm text-fg-brand tabular hover:underline focus-visible:focus-ring">{j.applications}</Link> },
    { key: 'valid', header: 'Valid through', sortable: true, cell: (j) => <span className="text-fg">{j.validThrough ? formatDate(`${j.validThrough}T12:00:00Z`) : 'Not set'}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Job Roles"
        description="Roles on /careers. Open roles appear in Google for Jobs."
        actions={
          <Button asChild>
            <Link href={`${BASE}/new`}>
              <Plus aria-hidden /> New role
            </Link>
          </Button>
        }
      />
      <section aria-label="Role numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active roles" value={count('open')} icon={CircleCheck} />
        <KpiCard label="Drafts" value={count('draft')} icon={FileText} />
        <KpiCard label="Applications" value={all.reduce((s, j) => s + j.applications, 0)} icon={Users} />
        <KpiCard label="Closed" value={count('closed')} icon={Briefcase} />
      </section>
      <section aria-label="Roles" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs base={BASE} query={query} tabs={[{ label: 'All', count: all.length }, ...jobStatuses.map((s) => ({ value: s, label: jobStatusLabel[s], count: count(s) }))]} />
        <div className="px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search roles" placeholder="Search roles…" />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(j) => j.id}
          base={BASE}
          query={query}
          caption="Job roles"
          empty={<p className="type-h5 text-fg">No roles here</p>}
          actions={(j) => (
            <>
              {j.status === 'open' && (
                <a
                  href={`/careers/${j.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${j.title} on the site (opens in a new tab)`}
                  title="View on the site"
                  className="grid size-9 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring"
                >
                  <ExternalLink className="size-4.5" aria-hidden />
                </a>
              )}
              <RowLink href={`${BASE}/${j.id}`} label={`Edit ${j.title}`}>
                <Pencil aria-hidden />
              </RowLink>
              <ConfirmDelete label={`Delete ${j.title}`} title="Delete this role?" description={`“${j.title}” is removed from the careers page. Its applications stay in Applications.`} action={deleteJob.bind(null, j.id)} />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="roles" />
      </section>
    </div>
  );
}
