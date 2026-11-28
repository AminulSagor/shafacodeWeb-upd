import type { Metadata } from 'next';

import { JobEditor } from '@/components/admin/jobs/job-editor';
import { requireAdmin } from '@/lib/auth';
import { emptyJob } from '@/lib/schemas/admin/job';

export const metadata: Metadata = { title: 'New job posting' };

export default async function NewJobPage() {
  await requireAdmin();
  return <JobEditor id={null} initial={emptyJob} savedAt="" />;
}
