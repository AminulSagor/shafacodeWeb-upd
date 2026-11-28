import { z } from 'zod';

import { publishStatuses } from '@/lib/admin/types';

export const slugField = z
  .string()
  .trim()
  .min(2, 'Add a URL slug.')
  .max(80, 'Keep the slug under 80 characters.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single dashes.');

export const mediaRef = z.object({
  path: z.string().min(1).max(400),
  alt: z.string().trim().max(250),
  width: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
});

export const seoField = z.object({
  metaTitle: z.string().trim().max(70, 'Keep the meta title under 70 characters.'),
  metaDescription: z.string().trim().max(170, 'Keep the meta description under 170 characters.'),
  canonicalUrl: z.union([z.literal(''), z.url({ protocol: /^https$/, message: 'Use a full https:// URL.' })]),
  noIndex: z.boolean(),
});

export const publishFields = {
  status: z.enum(publishStatuses),
  isFeatured: z.boolean(),
  /** datetime-local in Dhaka time, or '' */
  publishAt: z.string().max(20),
};

const optionalHttps = z.union([z.literal(''), z.url({ protocol: /^https?$/, message: 'Use a full URL starting with https://.' })]);
export { optionalHttps };

/** datetime-local (Dhaka, GMT+6) to Date; null when empty or invalid. */
export function dhakaDate(local: string) {
  if (!local) return null;
  const d = new Date(`${local.length === 16 ? `${local}:00` : local}+06:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Issues to a field map (first message per top-level field, nested as "a.b"). */
export function issuesToFields(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) out[i.path.map(String).join('.')] ??= i.message;
  return out;
}
