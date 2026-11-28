'use server';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { prepareUsage } from '@/lib/admin/media-usage';
import { slugTaken, nextPreviousSlugs } from '@/lib/admin/slugs';
import { db } from '@/lib/admin/source';
import { slugify } from '@/lib/data/case-studies';
import { categoryForService, caseStudySchema, type CaseStudyInput } from '@/lib/schemas/admin/case-study';
import { dhakaDate, issuesToFields } from '@/lib/schemas/admin/common';

const idField = z.string().min(1).max(128).regex(/^[\w-]+$/);
const paths = (d: { cover?: { path?: string } | null; gallery?: { path?: string }[] } | undefined) =>
  [d?.cover?.path, ...(d?.gallery ?? []).map((g) => g.path)].filter((p): p is string => !!p);

/** Creates or updates a case study; returns its id and slug. */
export async function saveCaseStudy(rawId: string | null, input: CaseStudyInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = caseStudySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  if (rawId !== null && !idField.safeParse(rawId).success) return { ok: false, error: 'Invalid id.' };
  const d = parsed.data;

  return adminAction(async (admin): Promise<ActionResult<{ id: string; slug: string }>> => {
    const col = db().collection('projects');
    const ref = rawId ? col.doc(rawId) : col.doc();
    const now = Timestamp.now();
    const scheduled = dhakaDate(d.publishAt);
    if (d.publishAt && !scheduled) return { ok: false, error: 'Pick a valid date and time.', fieldErrors: { publishAt: 'Pick a valid date and time.' } };

    const taken = await db().runTransaction(async (tx) => {
      if (await slugTaken(tx, 'projects', d.slug, ref.id)) return true;
      const snap = rawId ? await tx.get(ref) : null;
      if (rawId && !snap?.exists) throw new Error('Case study not found');
      const before = snap?.data();
      const writeUsage = await prepareUsage(tx, `case-study:${ref.id}`, paths(before as never), paths(d));

      const wasLive = before && (before.status === 'published' || !before.status || ['delivered', 'in-progress', 'ongoing'].includes(before.status));
      // Legacy documents had no slug: their live URL was built from the title and id.
      const liveSlug = before ? String(before.slug || `${slugify(String(before.title ?? ''))}-${ref.id.slice(0, 6).toLowerCase()}`) : null;
      const publishedAt =
        d.status === 'scheduled' || (d.status === 'published' && scheduled)
          ? Timestamp.fromDate(scheduled ?? new Date())
          : d.status === 'published'
            ? (before?.publishedAt ?? now)
            : (before?.publishedAt ?? null);

      tx.set(
        ref,
        {
          title: d.title,
          client: d.client,
          industry: d.industry,
          deliveryStatus: d.deliveryStatus,
          summary: d.summary,
          services: d.services,
          categories: [...new Set(d.services.map((s) => categoryForService[s]))],
          techStack: d.techStack,
          timeline: d.timeline,
          liveUrl: d.liveUrl,
          contactEmail: d.contactEmail,
          challenge: d.challenge,
          solution: d.solution,
          results: d.results.filter((r) => r.value && r.label),
          cover: d.cover,
          gallery: d.gallery,
          slug: d.slug,
          seo: d.seo,
          status: d.status,
          isFeatured: d.isFeatured,
          publishedAt,
          updatedAt: now,
          updatedBy: admin.id,
          ...(snap ? {} : { createdAt: now }),
          // Old links keep working: a published slug that changes is remembered.
          previousSlugs: nextPreviousSlugs(before, wasLive ? liveSlug : null, d.slug),
          // Legacy fields now live in summary / solution / liveUrl / contactEmail.
          ...(before && 'description' in before ? { description: FieldValue.delete() } : {}),
          ...(before && 'contact' in before ? { contact: FieldValue.delete() } : {}),
        },
        { merge: true }
      );
      writeUsage();
      return false;
    });
    if (taken) return { ok: false, error: 'That URL slug is taken.', fieldErrors: { slug: 'Another case study uses this slug, now or as an old link.' } };

    updateTag('projects');
    await logActivity(admin, `${rawId ? 'updated' : 'created'} case study “${d.client || d.title}”`);
    return { ok: true, message: d.status === 'draft' ? 'Draft saved' : d.status === 'scheduled' ? 'Scheduled' : 'Saved and live', data: { id: ref.id, slug: d.slug } };
  }, { revalidate: ['/portfolio', '/'] });
}

export async function deleteCaseStudy(rawId: string) {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false as const, error: 'Invalid id.' };
  return adminAction(async (admin) => {
    const ref = db().collection('projects').doc(parsed.data);
    let title = '';
    await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Case study not found');
      title = String(snap.get('client') || snap.get('title') || '');
      const writeUsage = await prepareUsage(tx, `case-study:${ref.id}`, paths(snap.data() as never), []);
      writeUsage();
      tx.delete(ref);
    });
    updateTag('projects');
    await logActivity(admin, `deleted case study “${title}”`);
    return { ok: true, message: 'Case study deleted' };
  }, { revalidate: ['/portfolio', '/'] });
}
