import 'server-only';

import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { fileTypeFromBuffer } from 'file-type';

import { requireAdmin } from '@/lib/auth';
import { isLegacyPublicUrl } from '@/lib/schemas/upload';

export type UploadKind = 'resume' | 'attachment' | 'affiliate' | 'media';

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
  /** Public site images; admin uploads only (no SVG). */
  media: { bucket: 'media', mimes: ['image/png', 'image/jpeg', 'image/webp'], maxBytes: 8 * 1024 * 1024 },
};

export const EXT: Record<string, string> = {
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
 * The old public-bucket upload is allowed in development, and in production
 * only with ALLOW_LEGACY_UPLOADS=true (it makes files public). Without either,
 * uploads fail closed until SUPABASE_SERVICE_ROLE_KEY is set.
 */
export const legacyUploadsAllowed = () =>
  process.env.NODE_ENV !== 'production' || process.env.ALLOW_LEGACY_UPLOADS === 'true';

/** True when files go to the private buckets through signed URLs. */
export const privateUploads = () => storageAdmin() !== null;

/**
 * A short-lived signed upload URL for a generated path. Files go straight
 * from the browser to storage, never through a server action body.
 */
export async function createSignedUpload(kind: UploadKind, mime: string) {
  const client = storageAdmin();
  if (!client) return null;
  const rule = uploadRules[kind];
  const path = `${kind}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${EXT[mime] ?? 'bin'}`;
  const { data, error } = await client.storage.from(rule.bucket).createSignedUploadUrl(path);
  if (error || !data) throw new Error(`Could not create upload URL: ${error?.message}`);
  return { bucket: rule.bucket, path, signedUrl: data.signedUrl };
}

/**
 * Checks the stored object: path shape for this kind, size from metadata
 * (before downloading anything), magic bytes, and that the extension matches
 * the detected type. Deletes the object on any mismatch.
 */
export async function verifyUpload(kind: UploadKind, path: string) {
  const client = storageAdmin();
  if (!client) return false;
  const rule = uploadRules[kind];
  const match = new RegExp(`^${kind}/\\d{4}-\\d{2}/[0-9a-f-]{36}\\.(pdf|png|jpg|webp)$`).exec(path);
  if (!match) return false;
  const bucket = client.storage.from(rule.bucket);
  const reject = async () => {
    await bucket.remove([path]);
    return false;
  };
  const info = await bucket.info(path);
  if (info.error || !info.data) return false;
  const size = info.data.size ?? Number.POSITIVE_INFINITY;
  if (size > rule.maxBytes) return reject();
  const { data, error } = await bucket.download(path);
  if (error || !data) return false;
  const buf = new Uint8Array(await data.slice(0, 4100).arrayBuffer());
  const type = await fileTypeFromBuffer(buf);
  if (!type || !rule.mimes.includes(type.mime) || EXT[type.mime] !== match[1]) return reject();
  return true;
}

/** Accepts a submitted file: a verified signed upload, or a legacy public URL while that mode is allowed. */
export async function acceptUpload(kind: UploadKind, file: { path: string } | { url: string }) {
  if ('path' in file) return verifyUpload(kind, file.path);
  return !privateUploads() && legacyUploadsAllowed() && isLegacyPublicUrl(file.url);
}

/**
 * A link to a private file that expires after 10 minutes; with `download`
 * the file is served as an attachment under that name. Admins only.
 */
export async function signedDownloadUrl(kind: UploadKind, path: string, download?: string) {
  await requireAdmin();
  const client = storageAdmin();
  if (!client) return null;
  const { data, error } = await client.storage.from(uploadRules[kind].bucket).createSignedUrl(path, 600, download ? { download } : undefined);
  return error || !data ? null : data.signedUrl;
}
