import { cookies } from 'next/headers';
import { Info } from 'lucide-react';

import { AdminFrame } from '@/components/admin/shell/admin-frame';
import { pipelineCounts } from '@/lib/admin/pipeline';
import { demoMode } from '@/lib/admin/source';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [counts, store] = await Promise.all([pipelineCounts(), cookies()]);
  return (
    <AdminFrame
      user={{ name: admin.name, email: admin.email, role: admin.role }}
      counts={counts}
      initialCollapsed={store.get('sc_sidebar')?.value === 'collapsed'}
    >
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
