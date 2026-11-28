import 'server-only';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

import { getDb, hasFirebaseCredentials } from '@/db/firebase-admin';

/** Client IP from the platform's header (Vercel overwrites x-real-ip and x-forwarded-for, so clients cannot spoof them there). */
export async function clientIp() {
  const h = await headers();
  return (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim();
}

/**
 * Fixed-window rate limit kept in Firestore (`rateLimits` collection, add a
 * TTL policy on `expiresAt`). Works on serverless, unlike in-memory counters.
 * Without Firestore (local development) it allows every request.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  if (!hasFirebaseCredentials()) return true;
  const windowId = Math.floor(Date.now() / 1000 / windowSeconds);
  // Hashed: a valid doc id whatever the key holds, and no raw IPs or emails stored.
  const id = createHash('sha256').update(`${key}:${windowId}`).digest('hex').slice(0, 40);
  const ref = getDb().collection('rateLimits').doc(id);
  try {
    return await getDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const count = (snap.exists ? (snap.data()?.count as number) : 0) ?? 0;
      if (count >= limit) return false;
      tx.set(
        ref,
        { count: FieldValue.increment(1), expiresAt: new Date((windowId + 1) * windowSeconds * 1000) },
        { merge: true }
      );
      return true;
    });
  } catch (error) {
    console.error('Rate limit check failed', error);
    return true; // fail open: never block real enquiries because of a counter error
  }
}
