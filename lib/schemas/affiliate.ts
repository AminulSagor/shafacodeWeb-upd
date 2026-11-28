import { z } from 'zod';

import { emailField, uploadedFile } from './upload';

const attachment = uploadedFile;

/** Partner (affiliate) lead, shared by the form and the server action. */
export const affiliateSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: emailField(),
  phone: z.string().trim().min(6, 'Enter a phone or WhatsApp number.').max(40),
  message: z.string().trim().max(2000).optional(),
  attachment: attachment.optional(),
  website: z.string().max(0).optional(),
});

export type AffiliateInput = z.input<typeof affiliateSchema>;
