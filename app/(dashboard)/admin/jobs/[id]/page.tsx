import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JobEditor } from '@/components/admin/jobs/job-editor';
import { getJobForEdit } from '@/lib/admin/jobs';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Edit job posting' };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const job = await getJobForEdit(id);
  if (!job) notFound();
  const { id: _id, updatedAt, applications: _a, ...initial } = job;
  return <JobEditor key={updatedAt} id={id} initial={{ ...initial, responsibilities: initial.responsibilities.length ? initial.responsibilities : [''], requirements: initial.requirements.length ? initial.requirements : [''] }} savedAt={updatedAt} />;
}
