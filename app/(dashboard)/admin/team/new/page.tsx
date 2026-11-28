import type { Metadata } from 'next';

import { TeamEditor } from '@/components/admin/team/team-editor';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'New team member' };

export default async function NewTeamMemberPage() {
  await requireAdmin();
  return (
    <TeamEditor
      id={null}
      initial={{ name: '', role: '', department: '', location: '', bio: '', photo: null, linkedinUrl: '', portfolioUrl: '', visible: true, isAuthor: false }}
      savedAt=""
    />
  );
}
