import type { Metadata } from 'next';

import { PostEditor } from '@/components/admin/posts/post-editor';
import { emptyPost } from '@/lib/schemas/admin/post';
import { listAuthors } from '@/lib/admin/team';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'New blog post' };

export default async function NewPostPage() {
  await requireAdmin();
  const authors = await listAuthors();
  return <PostEditor id={null} initial={{ ...emptyPost, authorId: authors[0]?.id ?? '' }} savedAt="" authors={authors} />;
}
