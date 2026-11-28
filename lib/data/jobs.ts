import 'server-only';

import { unstable_cache } from 'next/cache';
import type { DocumentData } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { fallbackJobs, type Job } from '@/content/careers';

const str = (v: unknown) => (typeof v === 'string' ? v : '');
function toIso(v: unknown) {
  if (v && typeof v === 'object' && 'toDate' in v) return (v as { toDate: () => Date }).toDate().toISOString();
  if (typeof v === 'string' && !Number.isNaN(Date.parse(v))) return new Date(v).toISOString();
  return '';
}

const employment: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contract',
  INTERN: 'Internship',
};

/** Open roles only; supports the current (type, location, jobDescription) and the 2026 schema. */
function toJob(d: DocumentData): Job | null {
  const status = str(d.status) || 'open';
  if (status !== 'open') return null;
  const validThrough = toIso(d.validThrough);
  if (validThrough && Date.parse(validThrough) < Date.now()) return null;
  const title = str(d.title);
  const slug = str(d.slug);
  if (!title || !slug) return null;
  const description = str(d.description) || str(d.jobDescription);
  const location = str(d.location) || [str(d.locationCity), str(d.locationCountry)].filter(Boolean).join(', ');
  const workMode = str(d.workMode);
  return {
    slug,
    title,
    department: str(d.department) || 'engineering',
    employmentType: employment[str(d.employmentType)] ?? (str(d.type) || 'Full-time'),
    workMode: workMode ? workMode.replace(/^\w/, (c) => c.toUpperCase()) : location || 'Remote',
    location: location || undefined,
    salary:
      d.salaryMin && d.salaryMax
        ? `${str(d.salaryCurrency) === 'BDT' ? '৳' : '$'}${Math.round(d.salaryMin / 1000)}k to ${Math.round(d.salaryMax / 1000)}k`
        : undefined,
    summary: str(d.summary) || description.replace(/[#*_>`-]/g, '').trim().split('\n').find(Boolean)?.slice(0, 200) || '',
    description,
    postedAt: toIso(d.datePosted ?? d.createdAt) || new Date().toISOString(),
    validThrough: validThrough || undefined,
  };
}

const readAll = unstable_cache(
  async (): Promise<Job[]> => {
    const snap = await getDb().collection('jobs').get();
    return snap.docs
      .map((doc) => toJob(doc.data()))
      .filter((j): j is Job => j !== null)
      .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  },
  ['jobs:open'],
  { tags: ['jobs'], revalidate: 600 }
);

export async function getJobs(): Promise<Job[]> {
  if (!hasFirebaseCredentials()) return fallbackJobs;
  try {
    return await readAll();
  } catch (error) {
    console.error('Failed to read jobs', error);
    return [];
  }
}

export async function getJob(slug: string) {
  return (await getJobs()).find((j) => j.slug === slug) ?? null;
}
