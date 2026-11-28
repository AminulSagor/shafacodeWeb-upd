import { z } from 'zod';

const attachment = z.union([
  z.object({ path: z.string().min(1).max(200), name: z.string().max(200), size: z.number(), type: z.string() }),
  z.object({ url: z.url(), name: z.string().max(200), size: z.number(), type: z.string() }),
]);

/** Partner (affiliate) lead, shared by the form and the server action. */
export const affiliateSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: z.email('Enter a valid email address.').max(200),
  phone: z.string().trim().min(6, 'Enter a phone or WhatsApp number.').max(40),
  message: z.string().trim().max(2000).optional(),
  attachment: attachment.optional(),
  website: z.string().max(0).optional(),
});

export type AffiliateInput = z.input<typeof affiliateSchema>;
