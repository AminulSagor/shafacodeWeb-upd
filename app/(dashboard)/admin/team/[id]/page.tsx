import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TeamEditor } from '@/components/admin/team/team-editor';
import { getTeamMemberForEdit } from '@/lib/admin/team';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Edit team member' };

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const m = await getTeamMemberForEdit(id);
  if (!m) notFound();
  const { id: _id, order: _o, photoUrl: _p, updatedAt, ...initial } = m;
  return <TeamEditor key={id} id={id} initial={initial} savedAt={updatedAt} />;
}
