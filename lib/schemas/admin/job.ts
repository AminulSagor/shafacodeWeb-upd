import { z } from 'zod';

import { seoField, slugField } from './common';

export const jobDepartments = ['engineering', 'design', 'marketing', 'sales', 'operations'] as const;
export const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'] as const;
export const workModes = ['remote', 'hybrid', 'onsite'] as const;
export const jobStatuses = ['draft', 'open', 'closed'] as const;

export const employmentLabel: Record<(typeof employmentTypes)[number], string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contract',
  INTERN: 'Internship',
};
export const workModeLabel: Record<(typeof workModes)[number], string> = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' };
export const jobStatusLabel: Record<(typeof jobStatuses)[number], string> = { draft: 'Draft', open: 'Active', closed: 'Closed' };

const money = z
  .string()
  .trim()
  .max(12)
  .refine((v) => !v || /^\d+$/.test(v.replace(/[,\s]/g, '')), 'Use a whole number.');

/** Job role editor payload (spec section 8), including the Google Jobs fields. */
export const jobSchema = z
  .object({
    title: z.string().trim().min(3, 'Add a job title.').max(120),
    summary: z.string().trim().max(200),
    description: z.string().max(30_000),
    department: z.enum(jobDepartments),
    employmentType: z.enum(employmentTypes),
    workMode: z.enum(workModes),
    locationCity: z.string().trim().max(60),
    locationCountry: z.string().trim().max(60),
    applicantCountries: z.array(z.string().trim().regex(/^[A-Z]{2}$/, 'Use two-letter country codes (BD, IN).')).max(30),
    salaryMin: money,
    salaryMax: money,
    salaryCurrency: z.enum(['USD', 'BDT']),
    salaryUnit: z.enum(['YEAR', 'MONTH']),
    responsibilities: z.array(z.string().trim().max(200)).max(20),
    requirements: z.array(z.string().trim().max(200)).max(20),
    status: z.enum(jobStatuses),
    acceptingApplications: z.boolean(),
    datePosted: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, 'Pick a valid date.'),
    validThrough: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, 'Pick a valid date.'),
    slug: slugField,
    seo: seoField,
  })
  .superRefine((d, ctx) => {
    const open = d.status === 'open';
    if (open && d.description.trim().length < 50) ctx.addIssue({ code: 'custom', path: ['description'], message: 'Describe the role before opening it.' });
    if (open && !d.datePosted) ctx.addIssue({ code: 'custom', path: ['datePosted'], message: 'Set the date posted.' });
    if (open && !d.validThrough) ctx.addIssue({ code: 'custom', path: ['validThrough'], message: 'Set until when the role is open.' });
    if (d.datePosted && d.validThrough && d.validThrough < d.datePosted) ctx.addIssue({ code: 'custom', path: ['validThrough'], message: 'Valid through must be after the date posted.' });
    if (open && d.workMode === 'remote' && !d.applicantCountries.length) ctx.addIssue({ code: 'custom', path: ['applicantCountries'], message: 'Google needs the countries a remote role can hire from.' });
    if (open && d.workMode !== 'remote' && (!d.locationCity || !d.locationCountry)) ctx.addIssue({ code: 'custom', path: ['locationCity'], message: 'Add the city and country for hybrid or on-site roles.' });
    const min = Number(d.salaryMin.replace(/[,\s]/g, '')) || 0;
    const max = Number(d.salaryMax.replace(/[,\s]/g, '')) || 0;
    if (min && max && max < min) ctx.addIssue({ code: 'custom', path: ['salaryMax'], message: 'The maximum is below the minimum.' });
  });

export type JobInput = z.infer<typeof jobSchema>;

export const emptyJob: JobInput = {
  title: '',
  summary: '',
  description: '',
  department: 'engineering',
  employmentType: 'FULL_TIME',
  workMode: 'remote',
  locationCity: '',
  locationCountry: '',
  applicantCountries: ['BD'],
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'BDT',
  salaryUnit: 'MONTH',
  responsibilities: [''],
  requirements: [''],
  status: 'draft',
  acceptingApplications: true,
  datePosted: '',
  validThrough: '',
  slug: '',
  seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
};
