import 'server-only';

import { cache } from 'react';
import type { DocumentData } from 'firebase-admin/firestore';

import { fallbackCaseStudies } from '@/content/case-studies';
import { serviceSlugs } from '@/content/services';
import { requireAdmin } from '@/lib/auth';
import { publicMediaUrl } from '@/lib/media';
import type { CaseStudyInput } from '@/lib/schemas/admin/case-study';
import { db, demoMode, iso, live, str, strs } from './source';
import { publishStatuses, type PublishStatus } from './types';

export type CaseStudyRow = {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  status: PublishStatus;
  isFeatured: boolean;
  coverUrl: string | null;
  updatedAt: string;
  publishedAt: string;
};

export type CaseStudyEdit = CaseStudyInput & { id: string; createdAt: string; updatedAt: string; publishedAtIso: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);

const status = (d: DocumentData): PublishStatus => {
  const s = str(d.status);
  return (publishStatuses as readonly string[]).includes(s) ? (s as PublishStatus) : 'published';
};

const ref = (v: unknown) => {
  if (!v || typeof v !== 'object') return null;
  const m = v as Record<string, unknown>;
  const path = str(m.path);
  return path ? { path, alt: str(m.alt), width: Number(m.width) || 0, height: Number(m.height) || 0 } : null;
};

/** Dhaka datetime-local string for an ISO date. */
export function dhakaLocal(isoDate: string) {
  if (!isoDate) return '';
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(isoDate))
      .map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Firestore doc (2026 or legacy) to the editor shape. */
function toEdit(id: string, d: DocumentData): CaseStudyEdit {
  const legacy = !d.slug;
  const contact = str(d.contact);
  const publishedAtIso = iso(d.publishedAt) || (status(d) === 'published' ? iso(d.createdAt) : '');
  return {
    id,
    title: str(d.title),
    client: str(d.client),
    industry: str(d.industry),
    deliveryStatus: ['in-progress', 'ongoing'].includes(str(d.deliveryStatus) || str(d.status)) ? 'in-progress' : 'delivered',
    summary: str(d.summary) || (legacy ? str(d.description).slice(0, 200) : ''),
    services: strs(d.services).filter((s): s is CaseStudyInput['services'][number] => (serviceSlugs as readonly string[]).includes(s)),
    techStack: strs(d.techStack),
    timeline: str(d.timeline),
    liveUrl: str(d.liveUrl) || (/^https?:\/\//.test(contact) ? contact : ''),
    contactEmail: str(d.contactEmail) || (contact.includes('@') ? contact : ''),
    challenge: str(d.challenge),
    solution: str(d.solution) || (legacy ? str(d.description) : ''),
    results: Array.isArray(d.results) ? d.results.map((r: Record<string, unknown>) => ({ value: str(r?.value), label: str(r?.label) })).slice(0, 3) : [],
    cover: ref(d.cover),
    gallery: Array.isArray(d.gallery) ? d.gallery.map(ref).filter((g): g is NonNullable<typeof g> => !!g) : [],
    slug: str(d.slug) || slugify(str(d.title)),
    seo: {
      metaTitle: str(d.seo?.metaTitle),
      metaDescription: str(d.seo?.metaDescription),
      canonicalUrl: str(d.seo?.canonicalUrl),
      noIndex: d.seo?.noIndex === true,
    },
    status: status(d),
    isFeatured: d.isFeatured === true,
    publishAt: dhakaLocal(publishedAtIso),
    publishedAtIso,
    createdAt: iso(d.createdAt),
    updatedAt: iso(d.updatedAt) || iso(d.createdAt),
  };
}

function demoEdits(): CaseStudyEdit[] {
  const statuses: PublishStatus[] = ['published', 'scheduled', 'published', 'draft', 'published', 'archived', 'published'];
  return fallbackCaseStudies.map((c, i) => ({
    id: `d-cs-${i + 1}`,
    title: c.title,
    client: c.client,
    industry: c.industry ?? c.tags[0] ?? '',
    deliveryStatus: c.delivery === 'ongoing' ? 'in-progress' : 'delivered',
    summary: c.summary,
    services: c.services,
    techStack: c.stack ?? [],
    timeline: c.timeline ?? '',
    liveUrl: '',
    contactEmail: '',
    challenge: c.challenge ?? '',
    solution: c.solution ?? '',
    results: c.results,
    cover: c.cover ? { path: c.cover.src, alt: c.cover.alt, width: c.cover.width, height: c.cover.height } : null,
    gallery: (c.gallery ?? []).map((g) => ({ path: g.src, alt: g.alt, width: g.width, height: g.height })),
    slug: c.slug,
    seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
    status: statuses[i % statuses.length]!,
    isFeatured: i < 3,
    publishAt: dhakaLocal(new Date(Date.now() - i * 5 * 86_400_000).toISOString()),
    publishedAtIso: new Date(Date.now() - i * 5 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - (i + 10) * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));
}

const readAll = cache(async (): Promise<CaseStudyEdit[]> => {
  await requireAdmin();
  if (demoMode()) return demoEdits();
  if (!live()) return [];
  const snap = await db().collection('projects').get();
  return snap.docs.map((d) => toEdit(d.id, d.data()));
});

export async function listCaseStudiesAdmin(): Promise<CaseStudyRow[]> {
  return (await readAll())
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      client: c.client,
      industry: c.industry,
      services: c.services,
      status: c.status,
      isFeatured: c.isFeatured,
      coverUrl: c.cover ? (c.cover.path.startsWith('/') ? c.cover.path : publicMediaUrl(c.cover.path)) : null,
      updatedAt: c.updatedAt,
      publishedAt: c.publishedAtIso,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCaseStudyForEdit(id: string) {
  return (await readAll()).find((c) => c.id === id) ?? null;
}
