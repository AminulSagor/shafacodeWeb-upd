import type { Metadata } from 'next';

import { CaseStudyEditor } from '@/components/admin/case-studies/case-study-editor';
import { emptyCaseStudy } from '@/lib/schemas/admin/case-study';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'New case study' };

export default async function NewCaseStudyPage() {
  await requireAdmin();
  return <CaseStudyEditor id={null} initial={emptyCaseStudy} savedAt="" />;
}
