'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { getJob } from '@/lib/data/jobs';
import { renderNotification, sendMail } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { applicationSchema, experienceLabels, type ApplicationInput } from '@/lib/schemas/application';
import { acceptUpload } from '@/lib/storage';

export type FormResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Job application: validate, rate limit, verify the resume, store, notify. */
export async function submitApplication(input: ApplicationInput): Promise<FormResult> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    // A filled honeypot means a bot: pretend success, store nothing.
    if (fieldErrors.website) return { ok: true };
    return { ok: false, error: 'Please check the highlighted fields.', fieldErrors };
  }
  const data = parsed.data;

  if (!(await rateLimit(`apply:${await clientIp()}`, 5, 3600))) {
    return { ok: false, error: 'Too many applications from this connection. Please try again in an hour.' };
  }

  const job = await getJob(data.jobSlug);
  if (!job) return { ok: false, error: 'This role is no longer open.' };

  if (!(await acceptUpload('resume', data.resume))) {
    return { ok: false, error: 'The resume could not be verified as a PDF.', fieldErrors: { resume: 'Upload a PDF up to 5 MB.' } };
  }

  const record = {
    jobSlug: job.slug,
    slug: job.slug, // legacy field read by the current admin
    jobTitle: job.title,
    subject: `Application for ${job.title}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    location: data.location || '',
    portfolioUrl: data.portfolioUrl || '',
    linkedinUrl: data.linkedinUrl || '',
    githubUrl: data.githubUrl || '',
    experienceRange: data.experienceRange,
    primaryFramework: data.primaryFramework || '',
    whyUs: data.whyUs || '',
    coverLetter: data.whyUs || '', // legacy field
    ...('path' in data.resume ? { resumePath: data.resume.path } : { resumeUrl: data.resume.url }),
    stage: 'new',
    isViewed: false,
    createdAt: FieldValue.serverTimestamp(),
  };

  if (!hasFirebaseCredentials()) {
    if (process.env.NODE_ENV === 'production') return { ok: false, error: 'Applications are temporarily unavailable.' };
    console.warn('Firestore is not configured; application not stored (development only).');
    return { ok: true };
  }

  try {
    await getDb().collection('apply-jobs').add(record);
  } catch (error) {
    console.error('Failed to store application', error);
    return { ok: false, error: 'Something went wrong. Please try again or email us.' };
  }

  try {
    const { html, text } = renderNotification(`New application: ${job.title}`, [
      { label: 'Name', value: data.fullName },
      { label: 'Email', value: data.email, href: `mailto:${data.email}` },
      { label: 'Phone', value: data.phone },
      { label: 'Location', value: data.location },
      { label: 'Experience', value: experienceLabels[data.experienceRange] },
      { label: 'Framework', value: data.primaryFramework },
      { label: 'Portfolio', value: data.portfolioUrl, href: data.portfolioUrl },
      { label: 'LinkedIn', value: data.linkedinUrl, href: data.linkedinUrl },
      { label: 'GitHub', value: data.githubUrl, href: data.githubUrl },
      { label: 'Why ShafaCode', value: data.whyUs },
      { label: 'Resume', value: 'Open it from the admin (Applications).' },
    ]);
    await sendMail({ subject: `New application: ${job.title} from ${data.fullName}`, html, text, replyTo: data.email });
  } catch (error) {
    console.error('Application stored but the notification email failed', error);
  }
  return { ok: true };
}

// Keep the exported type tidy for the client.
export type ApplicationFieldErrors = Partial<Record<keyof z.input<typeof applicationSchema>, string>>;
