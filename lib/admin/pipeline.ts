import 'server-only';

import { cache } from 'react';
import type { DocumentData } from 'firebase-admin/firestore';

import { requireAdmin } from '@/lib/auth';
import { demoApplications, demoInquiries, demoLeads } from './demo';
import { db, demoMode, iso, live, str, strs } from './source';
import {
  applicationStages,
  inquiryStatuses,
  leadStatuses,
  type AffiliateLead,
  type Application,
  type ApplicationStage,
  type Inquiry,
  type InquiryStatus,
  type LeadStatus,
} from './types';

const pick = <T extends string>(allowed: readonly T[], v: unknown, fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);

function toInquiry(id: string, d: DocumentData): Inquiry {
  const paths = strs(d.attachmentPaths).map((path) => ({ label: path.split('/').pop() ?? 'Attachment', path }));
  const urls = [...strs(d.attachmentUrls), ...(str(d.fileUrl) ? [str(d.fileUrl)] : [])].map((url) => ({
    label: decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? 'Attachment'),
    url,
  }));
  return {
    id,
    fullName: str(d.fullName) || str(d.name) || 'Unknown',
    email: str(d.email),
    phone: str(d.phone),
    company: str(d.company),
    projectType: str(d.projectType) || str(d.service) || 'other',
    budgetRange: str(d.budgetRange) || str(d.budget),
    timeline: str(d.timeline),
    message: str(d.message),
    attachments: [...paths, ...urls],
    source: str(d.source) || 'contact-page',
    estimate: typeof d.estimate === 'string' ? d.estimate : '',
    status: pick(inquiryStatuses, d.status, 'new'),
    createdAt: iso(d.createdAt) || iso(d.date),
  };
}

function toLead(id: string, d: DocumentData): AffiliateLead {
  const path = str(d.filePath);
  const url = str(d.fileUrl);
  return {
    id,
    fullName: str(d.fullName) || str(d.name) || 'Unknown',
    email: str(d.email),
    phone: str(d.phone),
    message: str(d.message),
    file: path || url ? { path: path || undefined, url: url || undefined } : undefined,
    status: pick(leadStatuses, d.status, 'new'),
    createdAt: iso(d.createdAt),
  };
}

function toApplication(id: string, d: DocumentData): Application {
  const path = str(d.resumePath);
  const url = str(d.resumeUrl) || str(d.resume) || str(d.fileUrl);
  return {
    id,
    jobSlug: str(d.jobSlug) || str(d.slug),
    jobTitle: str(d.jobTitle) || str(d.subject).replace(/^Application for /, '') || 'Unknown role',
    fullName: str(d.fullName) || str(d.name) || 'Unknown',
    email: str(d.email),
    phone: str(d.phone),
    location: str(d.location),
    portfolioUrl: str(d.portfolioUrl) || str(d.portfolio),
    linkedinUrl: str(d.linkedinUrl),
    githubUrl: str(d.githubUrl),
    experienceRange: str(d.experienceRange) || str(d.experience),
    primaryFramework: str(d.primaryFramework),
    whyUs: str(d.whyUs) || str(d.coverLetter),
    resume: path || url ? { path: path || undefined, url: url || undefined } : undefined,
    stage: pick(applicationStages, d.stage, 'new'),
    interviewAt: iso(d.interviewAt),
    isViewed: d.isViewed === true,
    createdAt: iso(d.createdAt) || iso(d.date),
  };
}

async function readAll<T>(collection: string, map: (id: string, d: DocumentData) => T) {
  const snap = await db().collection(collection).get();
  return snap.docs.map((doc) => map(doc.id, doc.data()));
}

/** Every inquiry, newest first. Loaded once per request. */
export const listInquiries = cache(async (): Promise<Inquiry[]> => {
  await requireAdmin();
  if (demoMode()) return [...demoInquiries].sort(byNewest);
  if (!live()) return [];
  return (await readAll('contact', toInquiry)).sort(byNewest);
});

export const listLeads = cache(async (): Promise<AffiliateLead[]> => {
  await requireAdmin();
  if (demoMode()) return [...demoLeads].sort(byNewest);
  if (!live()) return [];
  return (await readAll('affiliate-leads', toLead)).sort(byNewest);
});

export const listApplications = cache(async (): Promise<Application[]> => {
  await requireAdmin();
  if (demoMode()) return [...demoApplications].sort(byNewest);
  if (!live()) return [];
  return (await readAll('apply-jobs', toApplication)).sort(byNewest);
});

export async function getInquiry(id: string) {
  return (await listInquiries()).find((i) => i.id === id) ?? null;
}
export async function getLead(id: string) {
  return (await listLeads()).find((l) => l.id === id) ?? null;
}
export async function getApplication(id: string) {
  return (await listApplications()).find((a) => a.id === id) ?? null;
}

/** Sidebar badges: items that still need a first look. */
export async function pipelineCounts() {
  const [inquiries, leads, applications] = await Promise.all([listInquiries(), listLeads(), listApplications()]);
  return {
    inquiries: inquiries.filter((i) => i.status === 'new').length,
    affiliateLeads: leads.filter((l) => l.status === 'new').length,
    applications: applications.filter((a) => !a.isViewed).length,
  };
}

export type { InquiryStatus, LeadStatus, ApplicationStage };
