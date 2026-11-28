import 'server-only';

import { cache } from 'react';
import type { DocumentData } from 'firebase-admin/firestore';

import { requireAdmin } from '@/lib/auth';
import { demoContent } from './demo';
import { db, demoMode, iso, live, str } from './source';
import { publishStatuses, type ContentItem, type PublishStatus } from './types';

/** Legacy docs have no status (or a delivery status on projects): they are live. */
function status(d: DocumentData): PublishStatus {
  const s = str(d.status);
  if ((publishStatuses as readonly string[]).includes(s)) return s as PublishStatus;
  return 'published';
}

const toItem = (kind: ContentItem['kind']) => (id: string, d: DocumentData): ContentItem => ({
  id,
  kind,
  title: str(d.title) || 'Untitled',
  status: status(d),
  publishedAt: iso(d.publishedAt) || (status(d) === 'published' ? iso(d.createdAt) || iso(d.date) : ''),
  updatedAt: iso(d.updatedAt) || iso(d.createdAt) || iso(d.date),
  createdAt: iso(d.createdAt) || iso(d.date),
});

/** Posts and case studies as one list for the dashboard queue and counts. */
export const listContentSummary = cache(async (): Promise<ContentItem[]> => {
  await requireAdmin();
  if (demoMode()) return demoContent;
  if (!live()) return [];
  const [posts, projects] = await Promise.all([db().collection('blogs').get(), db().collection('projects').get()]);
  return [
    ...posts.docs.map((doc) => toItem('post')(doc.id, doc.data())),
    ...projects.docs.map((doc) => toItem('case-study')(doc.id, doc.data())),
  ];
});
