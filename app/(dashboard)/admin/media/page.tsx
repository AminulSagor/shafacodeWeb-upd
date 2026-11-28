import type { Metadata } from 'next';
import Link from 'next/link';
import { X } from 'lucide-react';

import { MediaDetail, MediaUpload } from '@/components/admin/media/media-tools';
import { Pagination, SearchBox, StatusTabs } from '@/components/admin/table/toolbar';
import { PageHeader } from '@/components/admin/ui/page-header';
import { formatDate } from '@/lib/admin/format';
import { listHref, matches, paginate, readListQuery } from '@/lib/admin/list';
import { listMedia } from '@/lib/admin/media';
import { requireAdmin } from '@/lib/auth';
import type { RawSearchParams } from '@/lib/search-params';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Media Library' };
const BASE = '/admin/media';
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/** Media Library. Figma: 59:6920 */
export default async function MediaPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const query = readListQuery(params);
  const all = await listMedia();
  const filter = query.get('filter');
  const filtered = all.filter(
    (m) => (filter === 'missing-alt' ? !m.alt : filter === 'unused' ? !m.usedIn.length : true) && matches(query.q, m.alt, m.path)
  );
  const page = paginate(filtered, query.page, 24);
  const selected = all.find((m) => m.id === query.get('id'));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Media Library" description="Images for case studies, posts, testimonials and the team. PNG, JPG or WebP up to 8 MB." actions={<MediaUpload />} />
      <div className={cn('grid items-start gap-4', selected && 'xl:grid-cols-[minmax(0,1fr)_--spacing(90)]')}>
        <section aria-label="Images" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
          <StatusTabs
          label="Filter images"
            base={BASE}
            query={query}
            param="filter"
            tabs={[
              { label: 'All', count: all.length },
              { value: 'missing-alt', label: 'Missing alt', count: all.filter((m) => !m.alt).length },
              { value: 'unused', label: 'Unused', count: all.filter((m) => !m.usedIn.length).length },
            ]}
          />
          <div className="px-5 py-4">
            <SearchBox base={BASE} query={query} label="Search images" placeholder="Search alt text or file name…" />
          </div>
          {page.rows.length ? (
            <ul className="grid grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-3 lg:grid-cols-4">
              {page.rows.map((m) => (
                <li key={m.id}>
                  <Link
                    href={listHref(BASE, params, { id: m.id, page: query.page })}
                    scroll={false}
                    aria-current={selected?.id === m.id ? 'true' : undefined}
                    className={cn(
                      'block overflow-hidden rounded-field border-2 focus-visible:focus-ring',
                      selected?.id === m.id ? 'border-action-primary-border' : 'border-transparent hover:border-line'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
                    <img src={m.url} alt="" className="aspect-4/3 w-full bg-surface-2 object-cover" loading="lazy" />
                    <span className="flex items-center justify-between gap-2 px-2.5 py-2">
                      <span className="truncate type-caption font-normal text-fg-muted">{m.alt || 'No alt text'}</span>
                      {!m.alt && <span className="shrink-0 rounded-xs bg-status-warning px-1.5 type-caption text-fg-warning">Alt</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-14 text-center type-body-sm text-fg-subtle">No images match.</p>
          )}
          <Pagination base={BASE} query={query} {...page} noun="images" />
        </section>
        {selected && (
          <aside aria-label="Image details" className="flex flex-col gap-4 rounded-md border border-line-subtle bg-surface-1 p-5 xl:sticky xl:top-19">
            <div className="flex items-center justify-between">
              <h2 className="type-h5 text-fg">Details</h2>
              <Link href={listHref(BASE, params, { page: query.page })} scroll={false} aria-label="Close details" className="grid size-9 place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring">
                <X className="size-4" aria-hidden />
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
            <img src={selected.url} alt="" className="w-full rounded-field bg-surface-2 object-contain" />
            <dl className="grid grid-cols-2 gap-2 type-caption">
              <dt className="text-fg-subtle">Size</dt>
              <dd className="text-fg">{selected.width && selected.height ? `${selected.width} × ${selected.height}` : 'Unknown'}{selected.size ? ` · ${kb(selected.size)}` : ''}</dd>
              <dt className="text-fg-subtle">Uploaded</dt>
              <dd className="text-fg">{formatDate(selected.createdAt) || 'Unknown'}</dd>
            </dl>
            <MediaDetail key={selected.id} id={selected.id} url={selected.url} alt={selected.alt} used={selected.usedIn} closeHref={listHref(BASE, params, { page: query.page })} />
          </aside>
        )}
      </div>
    </div>
  );
}
