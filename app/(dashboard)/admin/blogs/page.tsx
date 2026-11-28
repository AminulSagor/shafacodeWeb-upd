import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarClock, Check, ExternalLink, FileText, Pencil, Plus, Star } from 'lucide-react';

import { deletePost } from '@/actions/admin/posts';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { AdminTable, type Column } from '@/components/admin/table/admin-table';
import { ThumbCell } from '@/components/admin/table/thumb-cell';
import { Pagination, RowLink, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { UrlSelect } from '@/components/admin/table/url-select';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { PageHeader } from '@/components/admin/ui/page-header';
import { PublishBadge } from '@/components/admin/ui/status-badge';
import { Button } from '@/components/ui/button';
import { categoryLabel, categoryLabels } from '@/content/blog';
import { formatDate } from '@/lib/admin/format';
import { matches, paginate, readListQuery, sortBy } from '@/lib/admin/list';
import { listPostsAdmin, type PostRow } from '@/lib/admin/posts';
import { publishLabel, publishStatuses } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';
import type { RawSearchParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Blog Posts' };

const BASE = '/admin/blogs';
const sorters: Record<string, (p: PostRow) => string | number> = {
  title: (p) => p.title.toLowerCase(),
  author: (p) => p.authorName.toLowerCase(),
  status: (p) => publishStatuses.indexOf(p.status),
  updated: (p) => p.updatedAt,
};

/** Blog Posts. Figma: 57:5612 */
export default async function BlogPostsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listPostsAdmin();
  const status = query.get('status');
  const category = query.get('category');
  const filtered = all.filter((p) => (!status || p.status === status) && (!category || p.category === category) && matches(query.q, p.title, p.authorName));
  const page = paginate(query.sort && sorters[query.sort] ? sortBy(filtered, sorters[query.sort], query.dir) : filtered, query.page);
  const count = (s: string) => all.filter((p) => p.status === s).length;

  const columns: Column<PostRow>[] = [
    { key: 'title', header: 'Post', sortable: true, primary: true, cell: (p) => <ThumbCell src={p.coverUrl} title={p.title} meta={categoryLabel(p.category)} href={`${BASE}/${p.id}`} /> },
    { key: 'author', header: 'Author', sortable: true, cell: (p) => <span className="text-fg">{p.authorName || 'Not set'}</span> },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (p) => (
        <span className="flex items-center gap-2">
          <PublishBadge status={p.status} />
          {p.isFeatured && <Star className="size-4 fill-current text-icon-brand" aria-label="Featured" />}
        </span>
      ),
    },
    { key: 'updated', header: 'Updated', sortable: true, cell: (p) => <time dateTime={p.updatedAt} className="text-fg">{formatDate(p.updatedAt)}</time> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Blog Posts"
        description="Articles shown on /blogs. Drafts stay private until published."
        actions={
          <Button asChild>
            <Link href={`${BASE}/new`}>
              <Plus aria-hidden /> New post
            </Link>
          </Button>
        }
      />
      <section aria-label="Blog numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Published" value={count('published')} icon={Check} />
        <KpiCard label="Drafts" value={count('draft')} icon={FileText} />
        <KpiCard label="Scheduled" value={count('scheduled')} icon={CalendarClock} />
        <KpiCard label="Featured" value={all.filter((p) => p.isFeatured).length} icon={Star} />
      </section>
      <section aria-label="Blog posts" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <StatusTabs base={BASE} query={query} tabs={[{ label: 'All', count: all.length }, ...publishStatuses.map((s) => ({ value: s, label: publishLabel[s], count: count(s) }))]} />
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <SearchBox base={BASE} query={query} label="Search posts" placeholder="Search title or author…" />
          <UrlSelect param="category" label="Category" allLabel="All categories" options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))} className="w-full md:w-60" />
        </div>
        <AdminTable
          columns={columns}
          rows={page.rows}
          rowKey={(p) => p.id}
          base={BASE}
          query={query}
          caption="Blog posts"
          empty={
            <>
              <p className="type-h5 text-fg">No posts here</p>
              <Button asChild className="mt-4">
                <Link href={`${BASE}/new`}>
                  <Plus aria-hidden /> New post
                </Link>
              </Button>
            </>
          }
          actions={(p) => (
            <>
              {p.status === 'published' && (
                <a
                  href={`/blogs/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View “${p.title}” on the site (opens in a new tab)`}
                  title="View on the site"
                  className="grid size-9 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring"
                >
                  <ExternalLink className="size-4.5" aria-hidden />
                </a>
              )}
              <RowLink href={`${BASE}/${p.id}`} label={`Edit “${p.title}”`}>
                <Pencil aria-hidden />
              </RowLink>
              <ConfirmDelete label={`Delete “${p.title}”`} title="Delete this post?" description={`“${p.title}” is removed from the blog for good.`} action={deletePost.bind(null, p.id)} />
            </>
          )}
        />
        <Pagination base={BASE} query={query} {...page} noun="posts" />
      </section>
    </div>
  );
}
