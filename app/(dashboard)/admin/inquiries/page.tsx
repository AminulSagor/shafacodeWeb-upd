import type { Metadata } from 'next';
import { Check, Clock, Download, Eye, Inbox, Mail, Phone, Send, Wallet } from 'lucide-react';

import { deleteRecord, setInquiryStatus } from '@/actions/admin/pipeline';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { Person } from '@/components/admin/dashboard/person';
import { FactGrid, RecordDrawer } from '@/components/admin/pipeline/record-drawer';
import { NotesPanel } from '@/components/admin/pipeline/notes-panel';
import { StatusSelect } from '@/components/admin/pipeline/status-select';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { UrlSelect } from '@/components/admin/table/url-select';
import { ActionButton } from '@/components/admin/ui/action-button';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { InquiryBadge } from '@/components/admin/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { budgetLabel, budgetShort, formatDate, formatDateTime, isRecent, projectTypeLabel, projectTypeShort, relativeTime, timelineLabel } from '@/lib/admin/format';
import { listHref, matches, paginate, readListQuery, sortBy } from '@/lib/admin/list';
import { listNotes } from '@/lib/admin/notes';
import { listInquiries } from '@/lib/admin/pipeline';
import { inquiryStatuses, inquiryStatusLabel, type Inquiry } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';
import { budgetOptions, projectTypeOptions } from '@/lib/schemas/inquiry';
import type { RawSearchParams } from '@/lib/search-params';
import { signedDownloadUrl } from '@/lib/storage';

export const metadata: Metadata = { title: 'Contact Inquiries' };

const BASE = '/admin/inquiries';
/** Rough midpoints of the budget ranges, for the pipeline estimate (BDT). */
const budgetMid: Record<string, number> = { 'under-100k': 75_000, '100k-300k': 200_000, '300k-700k': 500_000, '700k+': 900_000 };
const budgetRank = Object.fromEntries(budgetOptions.map((o, i) => [o.value, i]));
const bdt = (n: number) => (n >= 1_000_000 ? `৳${(n / 1_000_000).toFixed(1)}M` : `৳${Math.round(n / 1000)}k`);

const sorters: Record<string, (i: Inquiry) => string | number> = {
  client: (i) => i.fullName.toLowerCase(),
  type: (i) => projectTypeShort(i.projectType),
  budget: (i) => budgetRank[i.budgetRange] ?? -1,
  submitted: (i) => i.createdAt,
  status: (i) => inquiryStatuses.indexOf(i.status),
};

function kpis(all: Inquiry[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const thisMonth = all.filter((i) => i.createdAt >= monthStart).length;
  const lastMonth = all.filter((i) => i.createdAt >= lastMonthStart && i.createdAt < monthStart).length;
  const change = lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null;
  const open = all.filter((i) => ['new', 'contacted', 'proposal'].includes(i.status));
  const value = open.reduce((s, i) => s + (budgetMid[i.budgetRange] ?? 0), 0);
  const replied = all.filter((i) => i.contactedAt && i.createdAt && Date.parse(i.createdAt) > Date.now() - 90 * 86_400_000);
  const avgHours = replied.length
    ? replied.reduce((s, i) => s + (Date.parse(i.contactedAt) - Date.parse(i.createdAt)) / 3_600_000, 0) / replied.length
    : null;
  return { change, thisMonth, open: open.length, value, avgHours };
}

/** Contact Inquiries. Figma: 55:3358 (mobile 62:9923), drawer 55:3991 */
export default async function InquiriesPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listInquiries();
  const status = query.get('status');
  const type = query.get('type');

  const filtered = all.filter(
    (i) => (!status || i.status === status) && (!type || i.projectType === type) && matches(query.q, i.fullName, i.company, i.email)
  );
  const sorted = query.sort && sorters[query.sort] ? sortBy(filtered, sorters[query.sort], query.dir) : filtered;
  const page = paginate(sorted, query.page);
  const k = kpis(all);

  const selectedId = query.get('id');
  const selected = selectedId ? all.find((i) => i.id === selectedId) : undefined;
  const [notes, files] = selected
    ? await Promise.all([
        listNotes('contact', selected.id),
        Promise.all(
          selected.attachments.map(async (a) => ({ label: a.label, href: a.path ? await signedDownloadUrl('attachment', a.path) : a.url ?? null }))
        ),
      ])
    : [[], []];
  const here = listHref(BASE, params, { page: query.page });

  const columns: Column<Inquiry>[] = [
    {
      key: 'client',
      header: 'Client & company',
      sortable: true,
      primary: true,
      cell: (i) => <Person name={i.fullName} sub={i.company || 'Independent'} href={listHref(BASE, params, { id: i.id, page: query.page })} />,
    },
    { key: 'contact', header: 'Contact', cell: (i) => <span className="text-fg">{i.email}</span>, className: 'max-xl:hidden' },
    {
      key: 'type',
      header: 'Project type',
      sortable: true,
      cell: (i) => (
        <Badge tone="neutral" dot>
          {projectTypeShort(i.projectType)}
        </Badge>
      ),
    },
    { key: 'budget', header: 'Budget', sortable: true, cell: (i) => <span className="text-fg tabular">{budgetShort(i.budgetRange)}</span> },
    {
      key: 'submitted',
      header: 'Submitted',
      sortable: true,
      cell: (i) => (
        <time dateTime={i.createdAt} className="text-fg whitespace-nowrap">
          {formatDate(i.createdAt)}
          {isRecent(i.createdAt) && <span className="text-fg-subtle"> · {relativeTime(i.createdAt)}</span>}
        </time>
      ),
    },
    { key: 'status', header: 'Status', sortable: true, cell: (i) => <InquiryBadge status={i.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contact Inquiries"
        description="Review, qualify and reply to incoming project requests."
        actions={
          <Button asChild variant="secondary">
            <a href="/admin/export/inquiries" download>
              <Download aria-hidden /> Export CSV
            </a>
          </Button>
        }
      />

      <section aria-label="Inquiry numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total inquiries"
          value={all.length}
          icon={Inbox}
          delta={k.change === null ? `+${k.thisMonth}` : `${k.change >= 0 ? '+' : ''}${k.change}%`}
          note={k.change === null ? 'this month' : 'vs last month'}
          tone={k.change !== null && k.change < 0 ? 'neutral' : 'success'}
        />
        <KpiCard label="New" value={all.filter((i) => i.status === 'new').length} icon={Mail} delta="Needs reply" tone="warning" />
        <KpiCard label="Pipeline value" value={bdt(k.value)} icon={Wallet} delta={`${k.open} open`} note="estimated from budgets" tone="neutral" />
        <KpiCard
          label="Avg. first reply"
          value={k.avgHours === null ? 'No data' : `${k.avgHours.toFixed(1)}h`}
          icon={Clock}
          note={k.avgHours === null ? 'Tracked from the first status change' : 'last 90 days'}
        />
      </section>

      <section aria-label="Inquiries" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs
          base={BASE}
          query={query}
          tabs={[
            { label: 'All', count: all.length },
            ...inquiryStatuses.map((s) => ({ value: s, label: inquiryStatusLabel[s], count: all.filter((i) => i.status === s).length })),
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search inquiries" placeholder="Search name, company or email…" />
          <UrlSelect
            param="type"
            label="Project type"
            allLabel="All project types"
            options={projectTypeOptions.map((o) => ({ value: o.value, label: o.label }))}
            className="w-full md:w-60"
          />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(i) => i.id}
          base={BASE}
          query={query}
          caption="Contact inquiries"
          empty={
            <>
              <p className="type-h5 text-fg">No inquiries match</p>
              <p className="mt-1 type-body-sm text-fg-muted">Try another status, type or search.</p>
            </>
          }
          actions={(i) => (
            <>
              <RowLink href={listHref(BASE, params, { id: i.id, page: query.page })} label={`Open ${i.fullName}`}>
                <Eye aria-hidden />
              </RowLink>
              <ConfirmDelete
                label={`Delete the inquiry from ${i.fullName}`}
                title="Delete this inquiry?"
                description={`The inquiry from ${i.fullName} and its notes are removed for good. Attached files stay in storage.`}
                action={deleteRecord.bind(null, 'inquiry', i.id)}
              />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="inquiries" />
      </section>

      {selected && (
        <RecordDrawer
          closeHref={here}
          name={selected.fullName}
          meta={[selected.company, formatDateTime(selected.createdAt)].filter(Boolean).join(' · ')}
          footer={
            <>
              <Button asChild>
                <a href={`mailto:${selected.email}?subject=${encodeURIComponent('Your ShafaCode project request')}`}>
                  <Send aria-hidden /> Reply by email
                </a>
              </Button>
              <ActionButton variant="secondary" className="w-full" disabled={selected.status !== 'new'} action={setInquiryStatus.bind(null, selected.id, 'contacted')}>
                <Check aria-hidden /> Mark contacted
              </ActionButton>
            </>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <a href={`mailto:${selected.email}`}>
                  <Mail aria-hidden /> {selected.email}
                </a>
              </Button>
              {selected.phone && (
                <Button asChild variant="secondary" size="sm">
                  <a href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>
                    <Phone aria-hidden /> {selected.phone}
                  </a>
                </Button>
              )}
            </div>
            <FactGrid
              facts={[
                { label: 'Project type', value: projectTypeLabel(selected.projectType) },
                { label: 'Budget', value: budgetLabel(selected.budgetRange) },
                { label: 'Timeline', value: timelineLabel(selected.timeline) },
                { label: 'Source', value: { 'contact-page': 'Contact page', 'home-cta': 'Website CTA', estimator: 'Website · Estimator' }[selected.source] ?? selected.source },
              ]}
            />
            {selected.estimate && (
              <p className="rounded-field border border-brand-soft-border bg-brand-soft p-3 type-body-sm text-fg">
                <span className="type-mono-xs text-fg-brand">Estimator · </span>
                {selected.estimate}
              </p>
            )}
            <div>
              <h3 className="type-mono-xs text-fg-subtle">Message</h3>
              <p className="mt-2 type-body whitespace-pre-line text-fg">{selected.message}</p>
            </div>
            {files.length > 0 && (
              <div>
                <h3 className="type-mono-xs text-fg-subtle">Attachments</h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {files.map((f) => (
                    <li key={f.label}>
                      {f.href ? (
                        <a href={f.href} target="_blank" rel="noopener noreferrer" className="rounded-sm type-body-sm text-fg-brand underline underline-offset-4 focus-visible:focus-ring">
                          {f.label}
                        </a>
                      ) : (
                        <span className="type-body-sm text-fg-subtle">{f.label} (storage not configured)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <StatusSelect
              key={selected.status}
              id="inquiry-status"
              label="Status"
              value={selected.status}
              options={inquiryStatuses.map((s) => ({ value: s, label: inquiryStatusLabel[s] }))}
              save={setInquiryStatus.bind(null, selected.id)}
            />
            <NotesPanel kind="inquiry" id={selected.id} notes={notes} />
          </div>
        </RecordDrawer>
      )}
    </div>
  );
}
