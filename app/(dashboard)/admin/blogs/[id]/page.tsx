import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostEditor } from '@/components/admin/posts/post-editor';
import { getPostForEdit } from '@/lib/admin/posts';
import { listAuthors } from '@/lib/admin/team';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Edit blog post' };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [post, authors] = await Promise.all([getPostForEdit(id), listAuthors()]);
  if (!post) notFound();
  const { id: _id, createdAt: _c, updatedAt, publishedAtIso: _p, authorName, ...initial } = post;
  // Legacy posts have an embedded author but no id: keep their name visible in the list.
  const options = initial.authorId || !authorName ? authors : [{ id: '', name: `${authorName} (legacy, pick a team member)` }, ...authors];
  return <PostEditor key={id} id={id} initial={initial} savedAt={updatedAt} authors={options} />;
}
