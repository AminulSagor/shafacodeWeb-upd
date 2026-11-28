'use server';

import { FieldValue } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { renderNotification, sendMail } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { affiliateSchema, type AffiliateInput } from '@/lib/schemas/affiliate';
import { acceptUpload } from '@/lib/storage';
import type { FormResult } from '@/actions/apply';

/** Partner application: validate, rate limit, store in `affiliate-leads`, notify. */
export async function submitAffiliateLead(input: AffiliateInput): Promise<FormResult> {
  const parsed = affiliateSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    if (fieldErrors.website) return { ok: true };
    return { ok: false, error: 'Please check the highlighted fields.', fieldErrors };
  }
  const d = parsed.data;
  if (!(await rateLimit(`affiliate:${await clientIp()}`, 5, 3600))) {
    return { ok: false, error: 'Too many requests from this connection. Please try again in an hour.' };
  }
  if (d.attachment && !(await acceptUpload('affiliate', d.attachment))) {
    return { ok: false, error: 'The file could not be verified.', fieldErrors: { attachment: 'Use a PDF or image up to 10 MB.' } };
  }
  if (!hasFirebaseCredentials()) {
    if (process.env.NODE_ENV === 'production') return { ok: false, error: 'The form is temporarily unavailable. Please email us.' };
    console.warn('Firestore is not configured; partner lead not stored (development only).');
    return { ok: true };
  }
  try {
    await getDb()
      .collection('affiliate-leads')
      .add({
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        message: d.message || '',
        ...(d.attachment ? ('path' in d.attachment ? { filePath: d.attachment.path } : { fileUrl: d.attachment.url }) : {}),
        status: 'new',
        createdAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Failed to store partner lead', error);
    return { ok: false, error: 'Something went wrong. Please try again or email us.' };
  }
  try {
    const { html, text } = renderNotification(`New partner application: ${d.fullName}`, [
      { label: 'Name', value: d.fullName },
      { label: 'Email', value: d.email, href: `mailto:${d.email}` },
      { label: 'Phone / WhatsApp', value: d.phone },
      { label: 'Message', value: d.message },
      { label: 'File', value: d.attachment?.name },
    ]);
    await sendMail({ subject: `New partner application from ${d.fullName}`, html, text, replyTo: d.email });
  } catch (error) {
    console.error('Partner lead stored but the notification email failed', error);
  }
  return { ok: true };
}
