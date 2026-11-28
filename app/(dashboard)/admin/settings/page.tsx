import type { Metadata } from 'next';
import Link from 'next/link';

import { AdminUsers } from '@/components/admin/settings/admin-users';
import { SettingsForm } from '@/components/admin/settings/settings-form';
import { PageHeader } from '@/components/admin/ui/page-header';
import { listAdmins } from '@/lib/admin/admins';
import { db, demoMode, iso, live } from '@/lib/admin/source';
import { requireAdmin } from '@/lib/auth';
import { first, type RawSearchParams } from '@/lib/search-params';
import { getSiteSettings } from '@/lib/settings';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Site Settings' };

/** Site Settings (owners only). Figma: 61:9626 */
export default async function SettingsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const me = await requireAdmin({ role: 'owner' });
  const tab = first((await searchParams).tab) === 'users' ? 'users' : 'general';
  const [settings, updatedAt] = await Promise.all([
    getSiteSettings(),
    !demoMode() && live() ? db().collection('settings').doc('site').get().then((s) => iso(s.get('updatedAt'))) : Promise.resolve(''),
  ]);
  const tabs = [
    { href: '/admin/settings', label: 'General', active: tab === 'general' },
    { href: '/admin/settings#seo', label: 'SEO' },
    { href: '/admin/settings#business', label: 'Business' },
    { href: '/admin/settings#notifications', label: 'Notifications' },
    { href: '/admin/settings?tab=users', label: 'Admin users', active: tab === 'users' },
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Site Settings" description="Brand, search defaults, business details and notifications for the public site." />
      <nav aria-label="Settings sections" className="overflow-x-auto border-b border-line-subtle">
        <ul className="flex w-max gap-6">
          {tabs.map((t) => (
            <li key={t.label}>
              <Link
                href={t.href}
                aria-current={t.active ? 'page' : undefined}
                className={cn(
                  '-mb-px block border-b-2 py-3 type-label whitespace-nowrap focus-visible:focus-ring',
                  t.active ? 'border-fg text-fg' : 'border-transparent text-fg-muted hover:text-fg'
                )}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {tab === 'users' ? <AdminUsers admins={await listAdmins()} meId={me.id} /> : <SettingsForm initial={settings} savedAt={updatedAt} />}
    </div>
  );
}
