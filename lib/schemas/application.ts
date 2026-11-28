import { z } from 'zod';

export const experienceRanges = ['0-1', '1-3', '3-5', '5-8', '8+'] as const;
export const experienceLabels: Record<(typeof experienceRanges)[number], string> = {
  '0-1': 'Less than 1 year',
  '1-3': '1 to 3 years',
  '3-5': '3 to 5 years',
  '5-8': '5 to 8 years',
  '8+': '8 years or more',
};

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
  .pipe(z.union([z.literal(''), z.url({ message: 'Enter a valid link.' })]))
  .optional();

const uploaded = z.union([
  z.object({ path: z.string().min(1).max(200), name: z.string().max(200), size: z.number(), type: z.string() }),
  z.object({ url: z.url(), name: z.string().max(200), size: z.number(), type: z.string() }),
]);

/** Job application, shared by the form and the server action. */
export const applicationSchema = z.object({
  jobSlug: z.string().min(1).max(120),
  fullName: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: z.email('Enter a valid email address.').max(200),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  portfolioUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  experienceRange: z.enum(experienceRanges, { message: 'Choose your years of experience.' }),
  primaryFramework: z.string().trim().max(80).optional(),
  whyUs: z.string().trim().max(500, 'Keep it under 500 characters.').optional(),
  resume: uploaded.refine((f) => f.type === 'application/pdf', 'Upload your resume as a PDF.'),
  consent: z.literal(true, { message: 'Please agree so we can store your application.' }),
  /** Honeypot: must stay empty */
  website: z.string().max(0).optional(),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
