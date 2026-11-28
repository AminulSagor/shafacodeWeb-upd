import 'server-only';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';
import { burnPasswordCheck, hashPassword, verifyPassword } from './password';
import type { AdminRole } from './session';

export type AdminUser = { id: string; email: string; name: string; role: AdminRole; sessionVersion: number };

const COLLECTION = 'admins';
const normalize = (email: string) => email.trim().toLowerCase();

/**
 * Local development without Firestore: one in-memory owner from ADMIN_USER and
 * ADMIN_PASS. Never active in production builds.
 */
const devMode = () => process.env.NODE_ENV !== 'production' && !hasFirebaseCredentials();
const devAdmin = { version: 0 };
function devUser(): AdminUser | null {
  const email = process.env.ADMIN_USER;
  if (!email || !process.env.ADMIN_PASS) return null;
  return { id: 'dev', email: normalize(email), name: 'Local admin', role: 'owner', sessionVersion: devAdmin.version };
}

function toUser(id: string, d: FirebaseFirestore.DocumentData): AdminUser {
  return {
    id,
    email: String(d.email ?? ''),
    name: String(d.name ?? d.email ?? 'Admin'),
    role: d.role === 'owner' ? 'owner' : 'editor',
    sessionVersion: typeof d.sessionVersion === 'number' ? d.sessionVersion : 0,
  };
}

/**
 * Checks credentials. On a project with no admin accounts yet, the old
 * ADMIN_USER / ADMIN_PASS pair signs in once and becomes the first owner
 * (stored with a scrypt hash); after that the env pair no longer works.
 */
export async function authenticate(emailInput: string, password: string): Promise<AdminUser | null> {
  const email = normalize(emailInput);

  if (devMode()) {
    const dev = devUser();
    const ok = dev && email === dev.email && password === process.env.ADMIN_PASS;
    if (!ok) await burnPasswordCheck(password);
    return ok ? dev : null;
  }
  if (!hasFirebaseCredentials()) return null;

  const db = getDb();
  const snap = await db.collection(COLLECTION).where('email', '==', email).limit(1).get();
  const doc = snap.docs[0];
  if (doc) {
    const hash = String(doc.get('passwordHash') ?? '');
    if (!hash || !(await verifyPassword(password, hash))) return null;
    await doc.ref.update({ lastLoginAt: FieldValue.serverTimestamp() });
    return toUser(doc.id, doc.data());
  }

  const envUser = process.env.ADMIN_USER;
  const envPass = process.env.ADMIN_PASS;
  if (envUser && envPass && email === normalize(envUser) && password === envPass) {
    const ref = db.collection(COLLECTION).doc();
    const created = await db.runTransaction(async (tx) => {
      const any = await tx.get(db.collection(COLLECTION).limit(1));
      if (!any.empty) return false;
      tx.set(ref, {
        email,
        name: 'Owner',
        role: 'owner',
        passwordHash: await hashPassword(password),
        sessionVersion: 0,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      });
      return true;
    });
    if (created) return { id: ref.id, email, name: 'Owner', role: 'owner', sessionVersion: 0 };
  }

  await burnPasswordCheck(password);
  return null;
}

/** The admin behind a session, or null when the account is gone or the session was revoked. */
export async function findAdmin(id: string, version: number): Promise<AdminUser | null> {
  if (devMode()) {
    const dev = devUser();
    return dev && id === dev.id && version === dev.sessionVersion ? dev : null;
  }
  if (!hasFirebaseCredentials()) return null;
  const snap = await getDb().collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  const user = toUser(snap.id, snap.data()!);
  return user.sessionVersion === version ? user : null;
}

/** Revokes every session of this admin. */
export async function bumpSessionVersion(id: string) {
  if (devMode()) {
    devAdmin.version += 1;
    return;
  }
  await getDb().collection(COLLECTION).doc(id).update({ sessionVersion: FieldValue.increment(1) });
}
