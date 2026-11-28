'use server';

import { FieldValue } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { renderNotification, sendMail } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { budgetOptions, inquirySchema, projectTypeOptions, timelineOptions, type InquiryInput } from '@/lib/schemas/inquiry';
import { acceptUpload } from '@/lib/storage';
import type { FormResult } from '@/actions/apply';

const label = (opts: readonly { value: string; label: string }[], v?: string) => opts.find((o) => o.value === v)?.label ?? v;

/** Contact inquiry: validate, rate limit, verify attachments, store in `contact`, notify the team. */
export async function submitInquiry(input: InquiryInput): Promise<FormResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    if (fieldErrors.website) return { ok: true }; // honeypot
    return { ok: false, error: 'Please check the highlighted fields.', fieldErrors };
  }
  const d = parsed.data;

  if (!(await rateLimit(`inquiry:${await clientIp()}`, 5, 3600))) {
    return { ok: false, error: 'Too many requests from this connection. Please try again in an hour, or email us.' };
  }

  for (const a of d.attachments) {
    if (!(await acceptUpload('attachment', a))) {
      return { ok: false, error: `“${a.name}” could not be verified.`, fieldErrors: { attachments: 'Use PDF, PNG, JPG or WebP files up to 10 MB.' } };
    }
  }

  const record = {
    fullName: d.fullName,
    name: d.fullName, // legacy field
    email: d.email,
    phone: d.phone || '',
    company: d.company || '',
    projectType: d.projectType,
    budgetRange: d.budgetRange || '',
    timeline: d.timeline || '',
    message: d.message,
    attachmentPaths: d.attachments.flatMap((a) => ('path' in a ? [a.path] : [])),
    attachmentUrls: d.attachments.flatMap((a) => ('url' in a ? [a.url] : [])),
    source: d.source,
    estimate: d.estimate || '',
    status: 'new',
    createdAt: FieldValue.serverTimestamp(),
  };

  if (!hasFirebaseCredentials()) {
    if (process.env.NODE_ENV === 'production') return { ok: false, error: 'The form is temporarily unavailable. Please email us.' };
    console.warn('Firestore is not configured; inquiry not stored (development only).');
    return { ok: true };
  }

  try {
    await getDb().collection('contact').add(record);
  } catch (error) {
    console.error('Failed to store inquiry', error);
    return { ok: false, error: 'Something went wrong. Please try again or email us.' };
  }

  try {
    const { html, text } = renderNotification(`New project inquiry from ${d.fullName}`, [
      { label: 'Name', value: d.fullName },
      { label: 'Email', value: d.email, href: `mailto:${d.email}` },
      { label: 'Phone / WhatsApp', value: d.phone },
      { label: 'Company', value: d.company },
      { label: 'Project type', value: label(projectTypeOptions, d.projectType) },
      { label: 'Budget', value: label(budgetOptions, d.budgetRange) },
      { label: 'Timeline', value: label(timelineOptions, d.timeline) },
      { label: 'Estimator', value: d.estimate },
      { label: 'Description', value: d.message },
      { label: 'Attachments', value: d.attachments.length ? d.attachments.map((a) => a.name).join(', ') : '' },
    ]);
    await sendMail({ subject: `New inquiry: ${label(projectTypeOptions, d.projectType)} from ${d.fullName}`, html, text, replyTo: d.email });
  } catch (error) {
    console.error('Inquiry stored but the notification email failed', error);
  }
  return { ok: true };
}
