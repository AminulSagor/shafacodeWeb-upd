import admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';

/**
 * Lazily initialised Firestore (Admin SDK).
 *
 * Initialising at import time crashed `next build` whenever the Firebase
 * credentials were not present (for example on a fresh checkout), because
 * Next.js imports every route module while it collects page data.
 */
let cached: Firestore | null = null;

export function hasFirebaseCredentials() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) && Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

export function getDb(): Firestore {
  if (cached) return cached;
  if (!hasFirebaseCredentials()) {
    throw new Error('Firebase credentials are not configured');
  }
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:
          process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    });
  }
  cached = admin.firestore();
  return cached;
}

/** Backwards compatible handle: resolves the Firestore instance on first use. */
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
