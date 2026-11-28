import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquareQuote, Pencil, Plus, Star, Video } from 'lucide-react';

import { deleteTestimonial } from '@/actions/admin/testimonials';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { ThumbCell } from '@/components/admin/table/thumb-cell';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { PublishBadge } from '@/components/admin/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/admin/format';
import { matches, paginate, readListQuery } from '@/lib/admin/list';
import { listTestimonialsAdmin, type TestimonialEdit } from '@/lib/admin/testimonials';
import { requireAdmin } from '@/lib/auth';
import type { RawSearchParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Testimonials' };
const BASE = '/admin/testimonials';

/** Testimonials. Figma: 59:5990 */
export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listTestimonialsAdmin();
  const type = query.get('type');
  const page = paginate(all.filter((t) => (!type || t.type === type) && matches(query.q, t.clientName, t.company, t.quote)), query.page);

  const columns: Column<TestimonialEdit>[] = [
    { key: 'client', header: 'Client', primary: true, cell: (t) => <ThumbCell src={t.avatarUrl} title={t.clientName} meta={[t.role, t.company].filter(Boolean).join(', ')} href={`${BASE}/${t.id}`} /> },
    { key: 'quote', header: 'Quote', cell: (t) => <span className="line-clamp-2 max-w-100 text-fg-muted">“{t.quote}”</span> },
    { key: 'type', header: 'Type', cell: (t) => <Badge tone={t.type === 'video' ? 'info' : 'neutral'}>{t.type === 'video' ? 'Video' : 'Text'}</Badge> },
    {
      key: 'status',
      header: 'Status',
      cell: (t) => (
        <span className="flex items-center gap-2">
          <PublishBadge status={t.status} />
          {t.isFeatured && <Star className="size-4 fill-current text-icon-brand" aria-label="Featured" />}
        </span>
      ),
    },
    { key: 'updated', header: 'Updated', cell: (t) => <span className="text-fg">{formatDate(t.updatedAt)}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Testimonials"
        description="Client quotes and video stories on the home page. Publish only with the client's permission."
        actions={
          <Button asChild>
            <Link href={`${BASE}/new`}>
              <Plus aria-hidden /> New testimonial
            </Link>
          </Button>
        }
      />
      <section aria-label="Testimonial numbers" className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Published" value={all.filter((t) => t.status === 'published').length} icon={MessageSquareQuote} />
        <KpiCard label="Video stories" value={all.filter((t) => t.type === 'video').length} icon={Video} />
        <KpiCard label="Featured" value={all.filter((t) => t.isFeatured).length} icon={Star} />
      </section>
      <section aria-label="Testimonials" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs
          base={BASE}
          query={query}
          param="type"
          tabs={[
            { label: 'All', count: all.length },
            { value: 'text', label: 'Text', count: all.filter((t) => t.type === 'text').length },
            { value: 'video', label: 'Video', count: all.filter((t) => t.type === 'video').length },
          ]}
        />
        <div className="px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search testimonials" placeholder="Search name, company or quote…" />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(t) => t.id}
          base={BASE}
          query={query}
          caption="Testimonials"
          empty={<p className="type-h5 text-fg">No testimonials yet</p>}
          actions={(t) => (
            <>
              <RowLink href={`${BASE}/${t.id}`} label={`Edit the testimonial from ${t.clientName}`}>
                <Pencil aria-hidden />
              </RowLink>
              <ConfirmDelete label={`Delete the testimonial from ${t.clientName}`} title="Delete this testimonial?" description={`The quote from ${t.clientName} is removed from the site for good.`} action={deleteTestimonial.bind(null, t.id)} />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="testimonials" />
      </section>
    </div>
  );
}
