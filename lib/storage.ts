import 'server-only';

import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { fileTypeFromBuffer } from 'file-type';

export type UploadKind = 'resume' | 'attachment' | 'affiliate';

/** Allowlists per upload kind (spec section 9). */
export const uploadRules: Record<UploadKind, { bucket: string; mimes: string[]; maxBytes: number }> = {
  resume: { bucket: 'resumes', mimes: ['application/pdf'], maxBytes: 5 * 1024 * 1024 },
  attachment: {
    bucket: 'attachments',
    mimes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 10 * 1024 * 1024,
  },
  affiliate: {
    bucket: 'attachments',
    mimes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 10 * 1024 * 1024,
  },
};

const EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

let admin: SupabaseClient | null = null;
/** Service-role client; null until SUPABASE_SERVICE_ROLE_KEY is configured. */
export function storageAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  admin ??= createClient(url, key, { auth: { persistSession: false } });
  return admin;
}

/**
 * A short-lived signed upload URL for a generated path. Files go straight
 * from the browser to storage, never through a server action body.
 */
export async function createSignedUpload(kind: UploadKind, mime: string) {
  const client = storageAdmin();
  if (!client) return null;
  const rule = uploadRules[kind];
  const path = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${EXT[mime] ?? 'bin'}`;
  const { data, error } = await client.storage.from(rule.bucket).createSignedUploadUrl(path);
  if (error || !data) throw new Error(`Could not create upload URL: ${error?.message}`);
  return { bucket: rule.bucket, path, signedUrl: data.signedUrl };
}

/**
 * Checks the stored object's size and magic bytes; deletes it on mismatch.
 * Returns true when the file is acceptable.
 */
export async function verifyUpload(kind: UploadKind, path: string) {
  const client = storageAdmin();
  if (!client) return false;
  const rule = uploadRules[kind];
  if (!/^[\w-]+\/[\w-]+\.(pdf|png|jpg|webp)$/.test(path)) return false;
  const { data, error } = await client.storage.from(rule.bucket).download(path);
  if (error || !data) return false;
  const buf = new Uint8Array(await data.arrayBuffer());
  const type = await fileTypeFromBuffer(buf.slice(0, 4100));
  const ok = buf.byteLength <= rule.maxBytes && !!type && rule.mimes.includes(type.mime);
  if (!ok) await client.storage.from(rule.bucket).remove([path]);
  return ok;
}
