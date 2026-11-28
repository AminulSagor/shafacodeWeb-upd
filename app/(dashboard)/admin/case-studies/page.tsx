import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ExternalLink, FileText, Folder, Pencil, Plus, Star } from 'lucide-react';

import { deleteCaseStudy } from '@/actions/admin/case-studies';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { ThumbCell } from '@/components/admin/table/thumb-cell';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { UrlSelect } from '@/components/admin/table/url-select';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { PublishBadge } from '@/components/admin/ui/status-badge';
import { Button } from '@/components/ui/button';
import { services } from '@/content/services';
import { listCaseStudiesAdmin, type CaseStudyRow } from '@/lib/admin/case-studies';
import { dhakaStart, formatDate } from '@/lib/admin/format';
import { matches, paginate, readListQuery, sortBy } from '@/lib/admin/list';
import { publishLabel, publishStatuses } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';
import type { RawSearchParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Case Studies' };

const BASE = '/admin/case-studies';
const shortService = Object.fromEntries(services.map((s) => [s.slug, s.shortTitle]));
const sorters: Record<string, (c: CaseStudyRow) => string | number> = {
  title: (c) => c.title.toLowerCase(),
  status: (c) => publishStatuses.indexOf(c.status),
  updated: (c) => c.updatedAt,
};

/** Case Studies. Figma: 57:4457 */
export default async function CaseStudiesPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listCaseStudiesAdmin();
  const status = query.get('status');
  const service = query.get('service');
  const filtered = all.filter(
    (c) => (!status || c.status === status) && (!service || c.services.includes(service)) && matches(query.q, c.title, c.client, c.industry)
  );
  const page = paginate(query.sort && sorters[query.sort] ? sortBy(filtered, sorters[query.sort], query.dir) : filtered, query.page);
  const month = dhakaStart('month');
  const count = (s: string) => all.filter((c) => c.status === s).length;

  const columns: Column<CaseStudyRow>[] = [
    {
      key: 'title',
      header: 'Case study',
      sortable: true,
      primary: true,
      cell: (c) => (
        <ThumbCell
          src={c.coverUrl}
          title={c.client || c.title}
          meta={[c.industry, c.services.map((s) => shortService[s]).slice(0, 2).join(' + ')].filter(Boolean).join(' · ')}
          href={`${BASE}/${c.id}`}
        />
      ),
    },
    {
      key: 'services',
      header: 'Services',
      cell: (c) => <span className="type-mono-xs text-fg-muted">{c.services.map((s) => shortService[s]).join(' · ') || 'None'}</span>,
      className: 'max-w-60',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (c) => (
        <span className="flex items-center gap-2">
          <PublishBadge status={c.status} />
          {c.isFeatured && <Star role="img" className="size-4 fill-current text-icon-brand" aria-label="Featured" />}
        </span>
      ),
    },
    { key: 'updated', header: 'Updated', sortable: true, cell: (c) => <time dateTime={c.updatedAt} className="text-fg">{formatDate(c.updatedAt)}</time> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Case Studies"
        description="Projects shown on /portfolio. Featured studies appear on the home page."
        actions={
          <Button asChild>
            <Link href={`${BASE}/new`}>
              <Plus aria-hidden /> New case study
            </Link>
          </Button>
        }
      />
      <section aria-label="Case study numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total" value={all.length} icon={Folder} />
        <KpiCard label="Published" value={count('published')} icon={Check} delta={`+${all.filter((c) => c.status === 'published' && c.publishedAt >= month).length}`} note="this month" />
        <KpiCard label="Featured" value={all.filter((c) => c.isFeatured).length} icon={Star} note="on the home page" />
        <KpiCard label="Drafts" value={count('draft')} icon={FileText} delta={`${count('scheduled')} scheduled`} tone="neutral" />
      </section>
      <section aria-label="Case studies" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs
          base={BASE}
          query={query}
          tabs={[{ label: 'All', count: all.length }, ...publishStatuses.map((s) => ({ value: s, label: publishLabel[s], count: count(s) }))]}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search case studies" placeholder="Search title or client…" />
          <UrlSelect param="service" label="Service" allLabel="All services" options={services.map((s) => ({ value: s.slug, label: s.title }))} className="w-full md:w-64" />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(c) => c.id}
          base={BASE}
          query={query}
          caption="Case studies"
          empty={
            <>
              <p className="type-h5 text-fg">No case studies here</p>
              <p className="mt-1 type-body-sm text-fg-muted">Create one to show it on the portfolio.</p>
              <Button asChild className="mt-4">
                <Link href={`${BASE}/new`}>
                  <Plus aria-hidden /> New case study
                </Link>
              </Button>
            </>
          }
          actions={(c) => (
            <>
              {c.status === 'published' && (
                <a
                  href={`/portfolio/${c.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${c.client || c.title} on the site (opens in a new tab)`}
                  title="View on the site"
                  className="grid size-9 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring"
                >
                  <ExternalLink className="size-4.5" aria-hidden />
                </a>
              )}
              <RowLink href={`${BASE}/${c.id}`} label={`Edit ${c.client || c.title}`}>
                <Pencil aria-hidden />
              </RowLink>
              <ConfirmDelete
                label={`Delete ${c.client || c.title}`}
                title="Delete this case study?"
                description={`“${c.title}” is removed from the portfolio for good. Its images stay in the media library.`}
                action={deleteCaseStudy.bind(null, c.id)}
              />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="case studies" />
      </section>
    </div>
  );
}
