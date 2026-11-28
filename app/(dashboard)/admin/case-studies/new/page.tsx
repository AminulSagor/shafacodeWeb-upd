import type { Metadata } from 'next';

import { CaseStudyEditor, emptyCaseStudy } from '@/components/admin/case-studies/case-study-editor';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'New case study' };

export default async function NewCaseStudyPage() {
  await requireAdmin();
  return <CaseStudyEditor id={null} initial={emptyCaseStudy} savedAt="" />;
}
