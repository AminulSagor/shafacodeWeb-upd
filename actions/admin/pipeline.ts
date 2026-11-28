'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction } from '@/lib/admin/action';
import { db } from '@/lib/admin/source';
import { applicationStages, inquiryStatuses, leadStatuses, inquiryStatusLabel } from '@/lib/admin/types';

const collections = { inquiry: 'contact', lead: 'affiliate-leads', application: 'apply-jobs' } as const;
type Kind = keyof typeof collections;

const id = z.string().min(1).max(128).regex(/^[\w-]+$/);
const noteText = z.string().trim().min(1, 'Write a note first.').max(2000);

async function nameOf(kind: Kind, docId: string) {
  const snap = await db().collection(collections[kind]).doc(docId).get();
  if (!snap.exists) throw new Error('Not found');
  return String(snap.get('fullName') ?? snap.get('name') ?? 'a record');
}

export async function setInquiryStatus(rawId: string, rawStatus: string) {
  const parsed = z.object({ id, status: z.enum(inquiryStatuses) }).safeParse({ id: rawId, status: rawStatus });
  if (!parsed.success) return { ok: false as const, error: 'Invalid status.' };
  return adminAction(async (admin) => {
    const ref = db().collection('contact').doc(parsed.data.id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This inquiry no longer exists.' };
    const previous = String(snap.get('status') ?? 'new');
    await ref.update({
      status: parsed.data.status,
      updatedAt: FieldValue.serverTimestamp(),
      // First move out of "new" records the reply time for the average.
      ...(previous === 'new' && parsed.data.status !== 'new' && !snap.get('contactedAt') ? { contactedAt: FieldValue.serverTimestamp() } : {}),
    });
    await logActivity(admin, `moved ${snap.get('fullName') ?? 'an inquiry'} to ${inquiryStatusLabel[parsed.data.status]}`);
    return { ok: true, message: `Status: ${inquiryStatusLabel[parsed.data.status]}`, data: previous };
  });
}

export async function setLeadStatus(rawId: string, rawStatus: string) {
  const parsed = z.object({ id, status: z.enum(leadStatuses) }).safeParse({ id: rawId, status: rawStatus });
  if (!parsed.success) return { ok: false as const, error: 'Invalid status.' };
  return adminAction(async (admin) => {
    const ref = db().collection('affiliate-leads').doc(parsed.data.id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This lead no longer exists.' };
    const previous = String(snap.get('status') ?? 'new');
    await ref.update({ status: parsed.data.status, updatedAt: FieldValue.serverTimestamp() });
    await logActivity(admin, `updated partner lead ${snap.get('fullName') ?? ''}`.trim());
    return { ok: true, message: 'Status updated', data: previous };
  });
}

export async function setApplicationStage(rawId: string, rawStage: string) {
  const parsed = z.object({ id, stage: z.enum(applicationStages) }).safeParse({ id: rawId, stage: rawStage });
  if (!parsed.success) return { ok: false as const, error: 'Invalid stage.' };
  return adminAction(async (admin) => {
    const ref = db().collection('apply-jobs').doc(parsed.data.id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This application no longer exists.' };
    const previous = String(snap.get('stage') ?? 'new');
    await ref.update({
      stage: parsed.data.stage,
      [`stageDates.${parsed.data.stage}`]: FieldValue.serverTimestamp(),
      isViewed: true,
      updatedAt: FieldValue.serverTimestamp(),
    });
    await logActivity(admin, `moved ${snap.get('fullName') ?? 'an applicant'} to ${parsed.data.stage}`);
    return { ok: true, message: 'Stage updated', data: previous };
  });
}

export async function addNote(kind: Kind, rawId: string, rawText: string) {
  const parsed = z.object({ id, text: noteText }).safeParse({ id: rawId, text: rawText });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid note.' };
  return adminAction(async (admin) => {
    await nameOf(kind, parsed.data.id);
    await db()
      .collection(collections[kind])
      .doc(parsed.data.id)
      .collection('notes')
      .add({ authorId: admin.id, author: admin.name, text: parsed.data.text, createdAt: FieldValue.serverTimestamp() });
    return { ok: true, message: 'Note added' };
  });
}

/** Deletes the record and its notes. Files stay in storage for the audit trail. */
export async function deleteRecord(kind: Kind, rawId: string) {
  const parsed = id.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection(collections[kind]).doc(parsed.data);
    const name = await nameOf(kind, parsed.data);
    const notes = await ref.collection('notes').get();
    const batch = db().batch();
    notes.docs.forEach((n) => batch.delete(n.ref));
    batch.delete(ref);
    await batch.commit();
    await logActivity(admin, `deleted ${kind === 'application' ? 'the application of' : 'the ' + kind + ' from'} ${name}`);
    return { ok: true, message: 'Deleted' };
  });
}

/** Interview time from a datetime-local value in Dhaka time (GMT+6); empty clears it. */
export async function setInterviewTime(rawId: string, local: string) {
  const parsedId = id.safeParse(rawId);
  if (!parsedId.success) return { ok: false as const, error: 'Invalid id.' };
  const at = local ? new Date(`${local}:00+06:00`) : null;
  if (local && (!at || Number.isNaN(at.getTime()))) return { ok: false as const, error: 'Pick a valid date and time.' };
  return adminAction(async (admin) => {
    const ref = db().collection('apply-jobs').doc(parsedId.data);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This application no longer exists.' };
    await ref.update({ interviewAt: at ?? FieldValue.delete(), updatedAt: FieldValue.serverTimestamp() });
    if (at) await logActivity(admin, `scheduled an interview with ${snap.get('fullName') ?? 'a candidate'}`);
    return { ok: true, message: at ? 'Interview time saved' : 'Interview time cleared' };
  });
}

const referral = z.object({
  referredProject: z.string().trim().max(160),
  partnerType: z.string().trim().max(80),
  estValue: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v.replace(/[^\d.]/g, '')) : null))
    .refine((v) => v === null || (Number.isFinite(v) && v >= 0 && v <= 1_000_000_000), 'Enter the value in taka.'),
});

/** The team records the referred project and its estimated value (for the commission). */
export async function updateLeadReferral(rawId: string, form: { referredProject: string; partnerType: string; estValue: string }) {
  const parsedId = id.safeParse(rawId);
  const parsed = referral.safeParse(form);
  if (!parsedId.success) return { ok: false as const, error: 'Invalid id.' };
  if (!parsed.success) {
    return { ok: false as const, error: 'Check the referral details.', fieldErrors: { estValue: parsed.error.issues[0]?.message ?? 'Invalid value.' } };
  }
  return adminAction(async (admin) => {
    const ref = db().collection('affiliate-leads').doc(parsedId.data);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This lead no longer exists.' };
    await ref.update({ ...parsed.data, updatedAt: FieldValue.serverTimestamp() });
    await logActivity(admin, `updated the referral from ${snap.get('fullName') ?? 'a partner'}`);
    return { ok: true, message: 'Referral saved' };
  });
}
