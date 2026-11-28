import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { TeamOrder } from '@/components/admin/team/team-order';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Button } from '@/components/ui/button';
import { listTeamAdmin } from '@/lib/admin/team';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Team Members' };

/** Team Members. Figma: 61:8755 */
export default async function TeamPage() {
  await requireAdmin();
  const team = await listTeamAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Team Members"
        description="People on the About page, in this order. Drag a row or use the arrows to reorder."
        actions={
          <Button asChild>
            <Link href="/admin/team/new">
              <Plus aria-hidden /> Add member
            </Link>
          </Button>
        }
      />
      <section aria-label="Team members" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
        <TeamOrder key={team.map((m) => m.id).join()} members={team.map((m) => ({ id: m.id, name: m.name, role: m.role, photoUrl: m.photoUrl, visible: m.visible, isAuthor: m.isAuthor }))} />
      </section>
    </div>
  );
}
