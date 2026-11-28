import 'server-only';

import { cache } from 'react';
import type { DocumentData } from 'firebase-admin/firestore';

import { fallbackJobs } from '@/content/careers';
import { requireAdmin } from '@/lib/auth';
import { employmentTypes, jobDepartments, jobStatuses, workModes, type JobInput } from '@/lib/schemas/admin/job';
import { dhakaDay } from './format';
import { db, demoMode, iso, live, str, strs } from './source';

export type JobEdit = JobInput & { id: string; updatedAt: string; applications: number };

const pick = <T extends string>(list: readonly T[], v: string, fallback: T): T => ((list as readonly string[]).includes(v) ? (v as T) : fallback);
const day = (v: unknown) => {
  const i = iso(v);
  return i ? dhakaDay(new Date(i)) : '';
};
const legacyType: Record<string, (typeof employmentTypes)[number]> = { 'full-time': 'FULL_TIME', 'part-time': 'PART_TIME', contract: 'CONTRACTOR', internship: 'INTERN' };

function toEdit(id: string, d: DocumentData, applications: number): JobEdit {
  const type = str(d.employmentType) || legacyType[str(d.type).toLowerCase()] || 'FULL_TIME';
  const legacyLocation = str(d.location);
  return {
    id,
    title: str(d.title),
    summary: str(d.summary),
    description: str(d.description) || str(d.jobDescription),
    department: pick(jobDepartments, str(d.department).toLowerCase(), 'engineering'),
    employmentType: pick(employmentTypes, type, 'FULL_TIME'),
    workMode: pick(workModes, str(d.workMode).toLowerCase() || (/remote/i.test(legacyLocation) ? 'remote' : 'onsite'), 'remote'),
    locationCity: str(d.locationCity) || (legacyLocation && !/remote/i.test(legacyLocation) ? legacyLocation.split(',')[0]!.trim() : ''),
    locationCountry: str(d.locationCountry) || (legacyLocation.includes(',') ? legacyLocation.split(',').pop()!.trim() : ''),
    applicantCountries: strs(d.applicantCountries),
    salaryMin: d.salaryMin ? String(d.salaryMin) : '',
    salaryMax: d.salaryMax ? String(d.salaryMax) : '',
    salaryCurrency: str(d.salaryCurrency) === 'USD' ? 'USD' : 'BDT',
    salaryUnit: str(d.salaryUnit) === 'YEAR' ? 'YEAR' : 'MONTH',
    responsibilities: strs(d.responsibilities),
    requirements: strs(d.requirements),
    status: pick(jobStatuses, str(d.status), 'open'),
    acceptingApplications: d.acceptingApplications !== false,
    datePosted: day(d.datePosted) || day(d.createdAt),
    validThrough: day(d.validThrough),
    slug: str(d.slug),
    seo: { metaTitle: str(d.seo?.metaTitle), metaDescription: str(d.seo?.metaDescription), canonicalUrl: str(d.seo?.canonicalUrl), noIndex: d.seo?.noIndex === true },
    updatedAt: iso(d.updatedAt) || iso(d.createdAt),
    applications,
  };
}

const readAll = cache(async (): Promise<JobEdit[]> => {
  await requireAdmin();
  if (demoMode()) {
    return fallbackJobs.map((j, i) => ({
      id: `d-job-${i + 1}`,
      title: j.title,
      summary: j.summary,
      description: j.description,
      department: pick(jobDepartments, j.department, 'engineering'),
      employmentType: legacyType[j.employmentType.toLowerCase()] ?? 'FULL_TIME',
      workMode: pick(workModes, j.workMode.toLowerCase(), 'remote'),
      locationCity: '',
      locationCountry: '',
      applicantCountries: ['BD'],
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'BDT',
      salaryUnit: 'MONTH',
      responsibilities: [],
      requirements: [],
      status: i === 2 ? 'draft' : 'open',
      acceptingApplications: true,
      datePosted: j.postedAt.slice(0, 10),
      validThrough: j.validThrough?.slice(0, 10) ?? '',
      slug: j.slug,
      seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
      updatedAt: j.postedAt,
      applications: [2, 2, 1][i] ?? 0,
    }));
  }
  if (!live()) return [];
  const [jobs, apps] = await Promise.all([db().collection('jobs').get(), db().collection('apply-jobs').select('jobSlug', 'slug').get()]);
  const counts = new Map<string, number>();
  for (const a of apps.docs) {
    const slug = str(a.get('jobSlug')) || str(a.get('slug'));
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return jobs.docs.map((d) => toEdit(d.id, d.data(), counts.get(str(d.get('slug'))) ?? 0)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
});

export const listJobsAdmin = readAll;
export async function getJobForEdit(id: string) {
  return (await readAll()).find((j) => j.id === id) ?? null;
}
