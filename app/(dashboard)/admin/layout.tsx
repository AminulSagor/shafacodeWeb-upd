import { cookies } from 'next/headers';
import Link from 'next/link';
import { Info, TriangleAlert } from 'lucide-react';

import { AdminFrame } from '@/components/admin/shell/admin-frame';
import { pipelineCounts } from '@/lib/admin/pipeline';
import { demoMode } from '@/lib/admin/source';
import { requireAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [counts, store, settings] = await Promise.all([pipelineCounts(), cookies(), getSiteSettings()]);
  return (
    <AdminFrame
      user={{ name: admin.name, email: admin.email, role: admin.role }}
      counts={counts}
      initialCollapsed={store.get('sc_sidebar')?.value === 'collapsed'}
    >
      {!settings.allowIndexing && (
        <p role="status" className="mb-6 flex flex-wrap items-center gap-2 rounded-field border border-line-subtle bg-status-danger px-4 py-2.5 type-body-sm text-fg-danger">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          Search engines are blocked: the site is set to noindex.
          {admin.role === 'owner' && (
            <Link href="/admin/settings#seo" className="rounded-sm underline underline-offset-4 focus-visible:focus-ring">
              Review in Site Settings
            </Link>
          )}
        </p>
      )}
      {demoMode() && (
        <p className="mb-6 flex items-center gap-2 rounded-field border border-line-subtle bg-status-info px-4 py-2.5 type-body-sm text-fg-info">
          <Info className="size-4 shrink-0" aria-hidden />
          Demo data: Firestore is not configured on this machine, so changes are not saved.
        </p>
      )}
      {children}
    </AdminFrame>
  );
}
