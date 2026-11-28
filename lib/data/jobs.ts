import 'server-only';

import { unstable_cache } from 'next/cache';
import type { DocumentData } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { fallbackJobs, type Job } from '@/content/careers';

import { toIso } from '@/lib/dates';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.replace(/[^\d.]/g, '')) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
};

const employment: Record<string, string> = {
  full_time: 'Full-time',
  'full-time': 'Full-time',
  fulltime: 'Full-time',
  part_time: 'Part-time',
  'part-time': 'Part-time',
  contractor: 'Contract',
  contract: 'Contract',
  intern: 'Internship',
  internship: 'Internship',
};
const currency: Record<string, string> = { BDT: '৳', USD: '$', EUR: '€', GBP: '£' };

function salary(d: DocumentData) {
  const min = num(d.salaryMin);
  const max = num(d.salaryMax);
  if (!min || !max) return undefined;
  const code = str(d.salaryCurrency).toUpperCase() || 'USD';
  const sign = currency[code] ?? `${code} `;
  return `${sign}${Math.round(min / 1000)}k to ${Math.round(max / 1000)}k`;
}

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
    department: (str(d.department) || 'engineering').toLowerCase(),
    employmentType: employment[(str(d.employmentType) || str(d.type)).toLowerCase()] ?? 'Full-time',
    workMode: workMode ? workMode.replace(/^\w/, (c) => c.toUpperCase()) : location || 'Remote',
    location: location || undefined,
    salary: salary(d),
    summary: str(d.summary) || description.replace(/[#*_>`-]/g, '').trim().split('\n').find(Boolean)?.slice(0, 200) || '',
    description,
    // No "now" fallback: a moving datePosted reads as freshness spam to Google.
    postedAt: toIso(d.datePosted ?? d.createdAt),
    validThrough: validThrough || undefined,
    team: str(d.team) || undefined,
    reportsTo: str(d.reportsTo) || undefined,
    applicantCountries: Array.isArray(d.applicantCountries)
      ? d.applicantCountries.filter((c: unknown): c is string => typeof c === 'string')
      : undefined,
  };
}

const readAll = unstable_cache(
  async (): Promise<Job[]> => {
    const snap = await getDb().collection('jobs').get();
    return snap.docs
      .map((doc) => toJob(doc.data()))
      .filter((j): j is Job => j !== null)
      .sort((a, b) => (b.postedAt || '').localeCompare(a.postedAt || ''));
  },
  ['jobs:open'],
  { tags: ['jobs'], revalidate: 600 }
);

export async function getJobs(): Promise<Job[]> {
  if (!hasFirebaseCredentials()) {
    return fallbackJobs.filter((j) => !j.validThrough || Date.parse(j.validThrough) >= Date.now());
  }
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
