'use server';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { logActivity } from '@/lib/admin/activity';
import { adminAction, type ActionResult } from '@/lib/admin/action';
import { prepareUsage } from '@/lib/admin/media-usage';
import { db } from '@/lib/admin/source';
import { hashPassword } from '@/lib/auth/password';
import { issuesToFields } from '@/lib/schemas/admin/common';
import { settingsSchema, type SiteSettings } from '@/lib/schemas/admin/settings';

const idField = z.string().min(1).max(128).regex(/^[\w-]+$/);
const password = z.string().min(12, 'Use at least 12 characters.').max(200);
const owner = { role: 'owner' as const };

export async function saveSettings(input: SiteSettings): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  return adminAction(async (admin) => {
    const ref = db().collection('settings').doc('site');
    const og = (v: unknown) => ((v as { path?: string } | null)?.path ? [(v as { path: string }).path] : []);
    const before = await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const writeUsage = await prepareUsage(tx, 'settings:og-image', og(snap.get('defaultOgImage')), og(parsed.data.defaultOgImage));
      tx.set(ref, { ...parsed.data, updatedAt: Timestamp.now(), updatedBy: admin.id }, { merge: true });
      writeUsage();
      return snap;
    });
    updateTag('settings');
    if (before.get('allowIndexing') !== false && !parsed.data.allowIndexing) await logActivity(admin, 'turned off search engine indexing');
    else await logActivity(admin, 'updated site settings');
    return { ok: true, message: 'Settings saved' };
  }, { ...owner, revalidate: ['/', '/robots.txt'] });
}

const newAdmin = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email.')),
  name: z.string().trim().min(2, 'Add the name.').max(80),
  role: z.enum(['owner', 'editor']),
  password,
});

export async function createAdmin(input: z.input<typeof newAdmin>): Promise<ActionResult> {
  const parsed = newAdmin.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Check the highlighted fields.', fieldErrors: issuesToFields(parsed.error.issues) };
  return adminAction(async (admin): Promise<ActionResult> => {
    const col = db().collection('admins');
    const passwordHash = await hashPassword(parsed.data.password);
    const exists = await db().runTransaction(async (tx) => {
      const clash = await tx.get(col.where('email', '==', parsed.data.email).limit(1));
      if (!clash.empty) return true;
      tx.set(col.doc(), {
        email: parsed.data.email,
        name: parsed.data.name,
        role: parsed.data.role,
        passwordHash,
        sessionVersion: 0,
        createdAt: Timestamp.now(),
        createdBy: admin.id,
      });
      return false;
    });
    if (exists) return { ok: false, error: 'An admin with this email exists.', fieldErrors: { email: 'Already an admin.' } };
    await logActivity(admin, `added ${parsed.data.name} as ${parsed.data.role}`);
    return { ok: true, message: 'Admin added. Share the password privately; they should change it soon.' };
  }, owner);
}

/** Owner count read inside a transaction, so two owners cannot remove each other at once. */
async function ownerCount(tx: FirebaseFirestore.Transaction) {
  return (await tx.get(db().collection('admins').where('role', '==', 'owner'))).size;
}

export async function setAdminRole(rawId: string, role: 'owner' | 'editor'): Promise<ActionResult> {
  const parsed = z.object({ id: idField, role: z.enum(['owner', 'editor']) }).safeParse({ id: rawId, role });
  if (!parsed.success) return { ok: false, error: 'Invalid request.' };
  return adminAction(async (admin): Promise<ActionResult> => {
    const ref = db().collection('admins').doc(parsed.data.id);
    const result = await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return 'This admin no longer exists.';
      if (snap.get('role') === 'owner' && parsed.data.role === 'editor' && (await ownerCount(tx)) <= 1) return 'Keep at least one owner.';
      // A role change signs the person out so the new role applies at once.
      tx.update(ref, { role: parsed.data.role, sessionVersion: FieldValue.increment(1) });
      return String(snap.get('name') ?? 'an admin');
    });
    if (result === 'This admin no longer exists.' || result === 'Keep at least one owner.') return { ok: false, error: result };
    await logActivity(admin, `made ${result} ${parsed.data.role}`);
    return { ok: true, message: 'Role updated' };
  }, owner);
}

export async function resetAdminPassword(rawId: string, newPassword: string): Promise<ActionResult> {
  const parsedId = idField.safeParse(rawId);
  const parsedPw = password.safeParse(newPassword);
  if (!parsedId.success) return { ok: false, error: 'Invalid request.' };
  if (!parsedPw.success) return { ok: false, error: parsedPw.error.issues[0]?.message ?? 'Invalid password.' };
  return adminAction(async (admin) => {
    const ref = db().collection('admins').doc(parsedId.data);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This admin no longer exists.' };
    await ref.update({ passwordHash: await hashPassword(parsedPw.data), sessionVersion: FieldValue.increment(1) });
    await logActivity(admin, `reset the password of ${snap.get('name') ?? 'an admin'}`);
    return { ok: true, message: 'Password reset; their sessions are signed out.' };
  }, owner);
}

export async function signOutAdmin(rawId: string): Promise<ActionResult> {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false, error: 'Invalid request.' };
  return adminAction(async (admin): Promise<ActionResult> => {
    const ref = db().collection('admins').doc(parsed.data);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: 'This admin no longer exists.' };
    await ref.update({ sessionVersion: FieldValue.increment(1) });
    await logActivity(admin, `signed out ${snap.get('name') ?? 'an admin'} on all devices`);
    return { ok: true, message: parsed.data === admin.id ? 'Signed out on all devices; sign in again.' : 'Signed out on all devices' };
  }, owner);
}

export async function deleteAdmin(rawId: string): Promise<ActionResult> {
  const parsed = idField.safeParse(rawId);
  if (!parsed.success) return { ok: false, error: 'Invalid request.' };
  return adminAction(async (admin): Promise<ActionResult> => {
    if (parsed.data === admin.id) return { ok: false, error: 'You cannot remove your own account.' };
    const ref = db().collection('admins').doc(parsed.data);
    const result = await db().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return { error: 'This admin no longer exists.' };
      if (snap.get('role') === 'owner' && (await ownerCount(tx)) <= 1) return { error: 'Keep at least one owner.' };
      tx.delete(ref);
      return { name: String(snap.get('name') ?? '') };
    });
    if ('error' in result) return { ok: false, error: result.error! };
    await logActivity(admin, `removed admin ${result.name}`);
    return { ok: true, message: 'Admin removed' };
  }, owner);
}
