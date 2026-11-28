import type { Metadata } from 'next';

import { TestimonialEditor } from '@/components/admin/testimonials/testimonial-editor';
import { listCaseStudiesAdmin } from '@/lib/admin/case-studies';
import { requireAdmin } from '@/lib/auth';
import { emptyTestimonial } from '@/lib/schemas/admin/testimonial';

export const metadata: Metadata = { title: 'New testimonial' };

export default async function NewTestimonialPage() {
  await requireAdmin();
  const cs = await listCaseStudiesAdmin();
  return <TestimonialEditor id={null} initial={emptyTestimonial} savedAt="" caseStudies={cs.map((c) => ({ id: c.id, label: c.client || c.title }))} />;
}
