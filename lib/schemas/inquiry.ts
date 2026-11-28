import { z } from 'zod';

import { emailField, uploadedFile } from './upload';

export const projectTypeOptions = [
  { value: 'website', label: 'Website' },
  { value: 'web-app', label: 'Web application' },
  { value: 'mobile-app', label: 'Mobile app' },
  { value: 'saas', label: 'SaaS product' },
  { value: 'custom-software', label: 'Custom software' },
  { value: 'ui-ux', label: 'UI/UX design' },
  { value: 'wordpress', label: 'WordPress website' },
  { value: 'iot', label: 'IoT & embedded' },
  { value: 'other', label: 'Something else' },
] as const;

export const budgetOptions = [
  { value: 'under-100k', label: 'Under ৳100k (~$850)' },
  { value: '100k-300k', label: '৳100k to ৳300k' },
  { value: '300k-700k', label: '৳300k to ৳700k' },
  { value: '700k+', label: '৳700k and above' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'Within 1 to 3 months' },
  { value: '3-6-months', label: 'Within 3 to 6 months' },
  { value: 'flexible', label: 'Flexible' },
] as const;

const values = <T extends readonly { value: string }[]>(o: T) => o.map((x) => x.value) as [T[number]['value'], ...T[number]['value'][]];

const attachment = uploadedFile;

/** Contact inquiry, shared by the form and the server action. */
export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: emailField(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
  projectType: z.enum(values(projectTypeOptions), { message: 'Choose a project type.' }),
  budgetRange: z.union([z.enum(values(budgetOptions)), z.literal('')]).optional(),
  timeline: z.union([z.enum(values(timelineOptions)), z.literal('')]).optional(),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters).').max(5000),
  attachments: z.array(attachment).max(3).default([]),
  source: z.enum(['contact-page', 'home-cta', 'estimator']).default('contact-page'),
  estimate: z.string().max(300).optional(),
  consent: z.literal(true, { message: 'Please agree so we can reply to you.' }),
  website: z.string().max(0).optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
