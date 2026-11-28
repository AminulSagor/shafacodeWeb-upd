'use server';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { slugTaken } from '@/lib/admin/slugs';
import { db } from '@/lib/admin/source';
import { issuesToFields } from '@/lib/schemas/admin/common';
import { jobSchema, type JobInput } from '@/lib/schemas/admin/job';

const idField = z.string().min(1).max(128).regex(/^[\w-]+$/);
/** A date (YYYY-MM-DD) at the given Dhaka time. */
const dhakaDay = (day: string, time: string) => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(day) ? new Date(`${day}T${time}+06:00`) : null;
  return d && !Number.isNaN(d.getTime()) ? Timestamp.fromDate(d) : null;
};
const num = (v: string) => Number(v.replace(/[,\s]/g, '')) || null;

export async function saveJob(rawId: string | null, input: JobInput): Promise<ActionResult<{ id: string }>> {
  const parsed = jobSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  if (rawId !== null && !idField.safeParse(rawId).success) return { ok: false, error: 'Invalid id.' };
  const d = parsed.data;

  return adminAction(async (admin): Promise<ActionResult<{ id: string }>> => {
    const col = db().collection('jobs');
    const ref = rawId ? col.doc(rawId) : col.doc();
    const now = Timestamp.now();
    const remote = d.workMode === 'remote';
    const outcome = await db().runTransaction(async (tx) => {
      if (await slugTaken(tx, 'jobs', d.slug, ref.id)) return 'taken';
      const snap = rawId ? await tx.get(ref) : null;
      if (rawId && !snap?.exists) return 'missing';
      const before = snap?.data();
      tx.set(
        ref,
        {
          title: d.title,
          summary: d.summary,
          description: d.description,
          department: d.department,
          employmentType: d.employmentType,
          workMode: d.workMode,
          locationCity: remote ? '' : d.locationCity,
          locationCountry: remote ? '' : d.locationCountry,
          applicantCountries: remote ? d.applicantCountries : [],
          salaryMin: num(d.salaryMin),
          salaryMax: num(d.salaryMax),
          salaryCurrency: d.salaryCurrency,
          salaryUnit: d.salaryUnit,
          responsibilities: d.responsibilities.filter(Boolean),
          requirements: d.requirements.filter(Boolean),
          status: d.status,
          acceptingApplications: d.acceptingApplications,
          datePosted: dhakaDay(d.datePosted, '09:00:00'),
          validThrough: dhakaDay(d.validThrough, '23:59:59'),
          slug: d.slug,
          seo: d.seo,
          updatedAt: now,
          updatedBy: admin.id,
          ...(rawId ? {} : { createdAt: now }),
          // Legacy fields are replaced by description, employmentType and the location fields.
          ...(before && 'jobDescription' in before ? { jobDescription: FieldValue.delete() } : {}),
          ...(before && 'location' in before ? { location: FieldValue.delete() } : {}),
          ...(before && 'type' in before ? { type: FieldValue.delete() } : {}),
        },
        { merge: true }
      );
      return 'ok';
    });
    if (outcome === 'taken') return { ok: false, error: 'That URL slug is taken.', fieldErrors: { slug: 'Another role uses this slug.' } };
    if (outcome === 'missing') return { ok: false, error: 'This role no longer exists.' };
    updateTag('jobs');
    await logActivity(admin, `${d.status === 'open' ? 'posted' : 'updated'} job “${d.title}”`);
    return { ok: true, message: d.status === 'open' ? 'Saved and live' : 'Saved', data: { id: ref.id } };
  }, { revalidate: ['/careers'] });
}

export async function deleteJob(rawId: string) {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection('jobs').doc(parsed.data);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This role no longer exists.' };
    await ref.delete();
    updateTag('jobs');
    await logActivity(admin, `deleted job “${snap.get('title') ?? ''}”`);
    return { ok: true, message: 'Role deleted. Its applications stay in Applications.' };
  }, { revalidate: ['/careers'] });
}
