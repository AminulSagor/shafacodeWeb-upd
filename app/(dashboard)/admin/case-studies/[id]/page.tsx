import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CaseStudyEditor } from '@/components/admin/case-studies/case-study-editor';
import { getCaseStudyForEdit } from '@/lib/admin/case-studies';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Edit case study' };

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const item = await getCaseStudyForEdit(id);
  if (!item) notFound();
  const { id: _id, createdAt: _c, updatedAt, publishedAtIso: _p, ...initial } = item;
  return <CaseStudyEditor key={id} id={id} initial={initial} savedAt={updatedAt} />;
}
