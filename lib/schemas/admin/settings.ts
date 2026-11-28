import { z } from 'zod';

import { site } from '@/content/site';
import { mediaRef, optionalHttps } from './common';

/** settings/site (spec section 8). */
export const settingsSchema = z.object({
  siteName: z.string().trim().min(2, 'Add the site name.').max(60),
  tagline: z.string().trim().max(120),
  domain: z.url({ protocol: /^https$/, message: 'Use the full https:// address.' }),
  titleTemplate: z
    .string()
    .trim()
    .max(60)
    .refine((v) => v.includes('%s'), 'Keep %s where the page title goes.'),
  defaultDescription: z.string().trim().min(50, 'Write at least 50 characters.').max(170),
  defaultOgImage: mediaRef.nullable(),
  allowIndexing: z.boolean(),
  legalName: z.string().trim().max(80),
  email: z.email('Enter a valid email.'),
  phone: z.string().trim().max(30),
  address: z.string().trim().max(160),
  linkedinUrl: optionalHttps,
  facebookUrl: optionalHttps,
  notifications: z.object({
    inquiry: z.boolean(),
    application: z.boolean(),
    affiliate: z.boolean(),
    weeklySummary: z.boolean(),
    recipient: z.email('Enter where notifications go.'),
  }),
  ga4Id: z.union([z.literal(''), z.string().trim().regex(/^G-[A-Z0-9]{4,12}$/, 'Looks like G-XXXXXXXXXX.')]),
  searchConsoleVerification: z.string().trim().max(120).regex(/^[\w-]*$/, 'Paste only the content value of the meta tag.'),
});

export type SiteSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: SiteSettings = {
  siteName: site.name,
  tagline: site.tagline,
  domain: site.url,
  titleTemplate: `%s | ${site.name}`,
  defaultDescription: site.description,
  defaultOgImage: null,
  allowIndexing: true,
  legalName: site.name,
  email: site.email,
  phone: site.phoneDisplay,
  address: `${site.address.locality}, ${site.address.country}`,
  linkedinUrl: site.social.linkedin,
  facebookUrl: site.social.facebook,
  notifications: { inquiry: true, application: true, affiliate: true, weeklySummary: false, recipient: site.email },
  ga4Id: '',
  searchConsoleVerification: '',
};
