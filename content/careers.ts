import type { LucideIcon } from 'lucide-react';
import { Briefcase, Code, Globe, GraduationCap, Heart, Users } from 'lucide-react';

export type Job = {
  slug: string;
  title: string;
  /** Optional heading with a serif accent for the job page */
  headline?: { before?: string; accent: string; after?: string };
  department: string;
  employmentType: string; // Full-time, Part-time, Contract, Internship
  workMode: string; // Remote, Hybrid, On-site or a city
  location?: string;
  salary?: string;
  summary: string;
  /** Markdown: role, responsibilities, requirements, benefits */
  description: string;
  postedAt: string; // ISO, '' when unknown
  validThrough?: string; // ISO
  team?: string;
  reportsTo?: string;
  /** ISO country codes a remote role can hire from (Google for Jobs). */
  applicantCountries?: string[];
};

export const perks: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: GraduationCap, title: 'Growth & learning', body: 'Structured learning paths and complex engineering challenges.' },
  { icon: Users, title: 'Collaborative culture', body: 'Open communication and shared success across design and engineering.' },
  { icon: Briefcase, title: 'Real client projects', body: 'Your code ships to real businesses, not a drawer.' },
  { icon: Code, title: 'Modern tech stack', body: 'Next.js, TypeScript, Flutter, Firebase and IoT hardware.' },
  { icon: Globe, title: 'Remote-friendly workflow', body: 'Flexible hours and remote options for healthy work-life balance.' },
  { icon: Heart, title: 'Mentorship & feedback', body: 'Regular 1:1s and code reviews with senior engineers.' },
];

export const hiringSteps = [
  { title: 'Apply online', body: 'Submit your details and CV through the form.', time: 'Day 0' },
  { title: 'Portfolio & CV review', body: 'We read every application, carefully.', time: 'Within 48 hours' },
  { title: 'Short interview', body: 'A 30-minute call about goals and fit.', time: 'Week 1' },
  { title: 'Paid skill task', body: 'A scoped, paid real-world task.', time: '3 days' },
  { title: 'Final interview', body: 'Meet the founders and team lead.', time: 'Week 2' },
  { title: 'Offer & onboarding', body: 'Welcome pack, buddy and first ticket.', time: 'Week 3' },
];

export const nextSteps = [
  { title: 'Application review', body: 'Reply within 48 hours' },
  { title: 'Technical screen', body: '45-minute conversation' },
  { title: 'Paid take-home', body: 'Scoped, real-world task' },
  { title: 'Final interview', body: 'Meet founders and team lead' },
];

const seniorFrontend = `## The role

We are looking for a deeply technical frontend engineer who treats UI implementation as an engineering discipline. You will architect scalable, high-performance interfaces for our clients' products.

You will work where design meets engineering, turning complex requirements into fluid, accessible experiences with React, Tailwind CSS and Framer Motion.

## What you will do

- Drive frontend architecture decisions for long-term maintainability
- Translate Figma designs into component-driven React code
- Audit and improve performance, accessibility and Core Web Vitals
- Mentor mid-level engineers through reviews and pairing

## Requirements

- 5+ years building complex, state-heavy React applications
- Mastery of Tailwind CSS and animation libraries like Framer Motion
- Strong TypeScript and testing discipline
- A product mindset: you think beyond the ticket

## Benefits

- Flexible paid time off
- Health coverage
- Home office stipend
- Learning budget for courses and conferences
`;

/** Seed roles from the Figma frames; used only when the CMS cannot be read. */
export const fallbackJobs: Job[] = [
  {
    slug: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer (React / Tailwind)',
    headline: { before: 'Senior', accent: 'Frontend Engineer', after: '(React / Tailwind)' },
    department: 'engineering',
    employmentType: 'Full-time',
    workMode: 'Remote',
    location: 'Remote (GMT-8 to GMT+6)',
    salary: '$80k to $120k',
    summary:
      'Join a focused pod of four engineers, one designer and a product manager building client platforms that real businesses run on.',
    description: seniorFrontend,
    postedAt: '2026-11-20T09:00:00.000Z',
    validThrough: '2026-12-31T23:59:59.000Z',
    team: 'Core platform pod',
    reportsTo: 'Engineering lead',
  },
  {
    slug: 'backend-developer-intern',
    title: 'Backend Developer Intern',
    department: 'engineering',
    employmentType: 'Part-time',
    workMode: 'Hybrid',
    location: 'Barishal, Bangladesh (hybrid)',
    summary: 'Learn production backend work on Node.js and Firebase with a senior mentor.',
    description:
      '## The role\n\nWork with our backend team on APIs, data models and integrations for client products, with a senior engineer reviewing every pull request.\n\n## Requirements\n\n- Comfortable with JavaScript or TypeScript\n- Curious about databases and APIs\n- Available for at least 20 hours a week\n',
    postedAt: '2026-11-12T09:00:00.000Z',
  },
  {
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'design',
    employmentType: 'Full-time',
    workMode: 'Remote',
    location: 'Remote',
    summary: 'Design flows, prototypes and design systems for web and mobile products.',
    description:
      '## The role\n\nOwn product design from discovery to developer handoff: user flows, wireframes, high-fidelity UI and design systems in Figma.\n\n## Requirements\n\n- 3+ years of product design for web or mobile\n- A portfolio with shipped work\n- Comfortable presenting decisions to clients\n',
    postedAt: '2026-11-05T09:00:00.000Z',
  },
];

export const departmentLabels: Record<string, string> = {
  engineering: 'Engineering',
  design: 'Design',
  marketing: 'Marketing',
  sales: 'Sales',
  operations: 'Operations',
  internship: 'Internship',
};

export const departmentLabel = (id: string) =>
  departmentLabels[id.toLowerCase()] ?? id.replace(/^\w/, (c) => c.toUpperCase());
