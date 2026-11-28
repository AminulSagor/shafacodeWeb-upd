import type { Metadata } from 'next';
import { Briefcase, Download, Eye, Mail, Percent, Phone, Send, Star, Users } from 'lucide-react';

import { deleteRecord, setLeadStatus } from '@/actions/admin/pipeline';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { Person } from '@/components/admin/dashboard/person';
import { NotesPanel } from '@/components/admin/pipeline/notes-panel';
import { RecordDrawer } from '@/components/admin/pipeline/record-drawer';
import { ReferralForm } from '@/components/admin/pipeline/referral-form';
import { StatusSelect } from '@/components/admin/pipeline/status-select';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { LeadBadge } from '@/components/admin/ui/status-badge';
import { Button } from '@/components/ui/button';
import { commissionFor } from '@/content/affiliate';
import { formatDateTime } from '@/lib/admin/format';
import { listHref, matches, paginate, readListQuery, sortBy } from '@/lib/admin/list';
import { listNotes } from '@/lib/admin/notes';
import { listLeads } from '@/lib/admin/pipeline';
import { leadStatuses, leadStatusLabel, type AffiliateLead } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';
import type { RawSearchParams } from '@/lib/search-params';
import { signedDownloadUrl } from '@/lib/storage';

export const metadata: Metadata = { title: 'Affiliate Leads' };

const BASE = '/admin/affiliate-leads';
const k = (n: number) => `৳${Math.round(n / 1000)}k`;
const range = (l: AffiliateLead) => {
  if (!l.estValue) return 'Not set';
  const c = commissionFor(l.estValue);
  return `${k(c.low)} – ${Math.round(c.high / 1000)}k`;
};
const sorters: Record<string, (l: AffiliateLead) => string | number> = {
  partner: (l) => l.fullName.toLowerCase(),
  project: (l) => l.referredProject.toLowerCase(),
  value: (l) => l.estValue ?? 0,
  status: (l) => leadStatuses.indexOf(l.status),
};

/** Affiliate Leads. Figma: 55:4666 */
export default async function AffiliateLeadsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listLeads();
  const status = query.get('status');
  const filtered = all.filter((l) => (!status || l.status === status) && matches(query.q, l.fullName, l.email, l.referredProject, l.partnerType));
  const page = paginate(query.sort && sorters[query.sort] ? sortBy(filtered, sorters[query.sort], query.dir) : filtered, query.page);

  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const quarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString();
  const partners = new Set(all.filter((l) => l.status !== 'lost').map((l) => l.email.toLowerCase())).size;
  const referred = all.filter((l) => l.referredProject);
  const won = all.filter((l) => l.status === 'won');
  const owed = won.reduce((s, l) => s + (l.estValue ? commissionFor(l.estValue).high : 0), 0);

  const selectedId = query.get('id');
  const selected = selectedId ? all.find((l) => l.id === selectedId) : undefined;
  const [notes, fileHref] = selected
    ? await Promise.all([
        listNotes('affiliate-leads', selected.id),
        selected.file?.path ? signedDownloadUrl('affiliate', selected.file.path) : Promise.resolve(selected.file?.url ?? null),
      ])
    : [[], null];

  const columns: Column<AffiliateLead>[] = [
    {
      key: 'partner',
      header: 'Partner',
      sortable: true,
      primary: true,
      cell: (l) => <Person name={l.fullName} sub={l.partnerType || l.email} href={listHref(BASE, params, { id: l.id, page: query.page })} />,
    },
    { key: 'project', header: 'Referred project', sortable: true, cell: (l) => <span className="text-fg">{l.referredProject || <span className="text-fg-subtle">Not yet</span>}</span> },
    { key: 'value', header: 'Est. value', sortable: true, cell: (l) => <span className="text-fg tabular">{l.estValue ? k(l.estValue) : 'Not set'}</span> },
    { key: 'commission', header: 'Commission', cell: (l) => <span className="text-fg tabular">{range(l)}</span> },
    { key: 'status', header: 'Status', sortable: true, cell: (l) => <LeadBadge status={l.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Affiliate Leads"
        description="Partner applications and referred projects with commission tracking."
        actions={
          <Button asChild variant="secondary">
            <a href="/admin/export/affiliate-leads" download>
              <Download aria-hidden /> Export CSV
            </a>
          </Button>
        }
      />
      <section aria-label="Partner numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active partners" value={partners} icon={Users} delta={`+${all.filter((l) => l.createdAt >= month).length}`} note="this month" />
        <KpiCard label="Referred projects" value={referred.length} icon={Briefcase} delta={`${all.filter((l) => l.status === 'new').length} new`} tone="warning" />
        <KpiCard label="Commission owed" value={k(owed)} icon={Percent} delta="due" note="at kickoff" tone="neutral" />
        <KpiCard label="Won referrals" value={won.length} icon={Star} delta={`+${won.filter((l) => l.createdAt >= quarter).length}`} note="this quarter" />
      </section>

      <section aria-label="Leads" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs
          base={BASE}
          query={query}
          tabs={[
            { label: 'All', count: all.length },
            ...leadStatuses.map((s) => ({ value: s, label: leadStatusLabel[s], count: all.filter((l) => l.status === s).length })),
          ]}
        />
        <div className="px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search leads" placeholder="Search partner or project…" />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(l) => l.id}
          base={BASE}
          query={query}
          caption="Affiliate leads"
          empty={
            <>
              <p className="type-h5 text-fg">No leads match</p>
              <p className="mt-1 type-body-sm text-fg-muted">Partner applications from the website appear here.</p>
            </>
          }
          actions={(l) => (
            <>
              <RowLink href={listHref(BASE, params, { id: l.id, page: query.page })} label={`Open ${l.fullName}`}>
                <Eye aria-hidden />
              </RowLink>
              <ConfirmDelete
                label={`Delete the lead from ${l.fullName}`}
                title="Delete this lead?"
                description={`The partner lead from ${l.fullName} and its notes are removed for good.`}
                action={deleteRecord.bind(null, 'lead', l.id)}
              />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="leads" />
      </section>

      {selected && (
        <RecordDrawer
          closeHref={listHref(BASE, params, { page: query.page })}
          name={selected.fullName}
          meta={[selected.partnerType, formatDateTime(selected.createdAt)].filter(Boolean).join(' · ')}
          footer={
            <Button asChild className="col-span-2">
              <a href={`mailto:${selected.email}?subject=${encodeURIComponent('Your ShafaCode partner kit')}`}>
                <Send aria-hidden /> Reply by email
              </a>
            </Button>
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
            {selected.message && (
              <div>
                <h3 className="type-mono-xs text-fg-subtle">Message</h3>
                <p className="mt-2 type-body whitespace-pre-line text-fg">{selected.message}</p>
              </div>
            )}
            {selected.file && (
              <p className="type-body-sm">
                {fileHref ? (
                  <a href={fileHref} target="_blank" rel="noopener noreferrer" className="rounded-sm text-fg-brand underline underline-offset-4 focus-visible:focus-ring">
                    Open the attachment
                  </a>
                ) : (
                  <span className="text-fg-subtle">Attachment stored (storage not configured here)</span>
                )}
              </p>
            )}
            <ReferralForm
              key={`${selected.id}-${selected.estValue}-${selected.referredProject}`}
              id={selected.id}
              initial={{ referredProject: selected.referredProject, partnerType: selected.partnerType, estValue: selected.estValue }}
            />
            <StatusSelect
              key={selected.status}
              id="lead-status"
              label="Status"
              value={selected.status}
              options={leadStatuses.map((s) => ({ value: s, label: leadStatusLabel[s] }))}
              save={setLeadStatus.bind(null, selected.id)}
            />
            <NotesPanel kind="lead" id={selected.id} notes={notes} />
          </div>
        </RecordDrawer>
      )}
    </div>
  );
}
