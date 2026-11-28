import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TestimonialEditor } from '@/components/admin/testimonials/testimonial-editor';
import { listCaseStudiesAdmin } from '@/lib/admin/case-studies';
import { getTestimonialForEdit } from '@/lib/admin/testimonials';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Edit testimonial' };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [item, cs] = await Promise.all([getTestimonialForEdit(id), listCaseStudiesAdmin()]);
  if (!item) notFound();
  const { id: _id, avatarUrl: _a, updatedAt, ...initial } = item;
  return <TestimonialEditor key={id} id={id} initial={initial} savedAt={updatedAt} caseStudies={cs.map((c) => ({ id: c.id, label: c.client || c.title }))} />;
}
