import 'server-only';

import type { ActivityEvent, AffiliateLead, Application, ContentItem, Inquiry } from './types';

/** Demo records for local development without Firestore (never used in production). */
const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();
const ahead = (hours: number) => new Date(Date.now() + hours * 3600_000).toISOString();

const inquiry = (p: Partial<Inquiry> & Pick<Inquiry, 'id' | 'fullName' | 'company' | 'projectType' | 'budgetRange' | 'status'>, hours: number): Inquiry => ({
  email: `${p.fullName.split(' ')[0]!.toLowerCase()}@example.com`,
  phone: '+880 1700-000000',
  timeline: '1-3-months',
  message:
    'We are looking for a team to design and build the first version of our product. We have a rough scope and a few screens sketched out, and would like to launch in about three months.',
  attachments: [],
  source: 'contact-page',
  estimate: '',
  createdAt: ago(hours),
  ...p,
});

export const demoInquiries: Inquiry[] = [
  inquiry({ id: 'd-inq-1', fullName: 'Sarah Jenkins', company: 'TechFlow Logistics', projectType: 'saas', budgetRange: '300k-700k', status: 'new', source: 'estimator', estimate: 'SaaS with: User accounts & roles, Admin panel. ৳235k to ৳475k, 11 to 19 weeks.' }, 3),
  inquiry({ id: 'd-inq-2', fullName: 'Michael Chen', company: 'Apex Financial', projectType: 'web-app', budgetRange: '100k-300k', status: 'contacted' }, 20),
  inquiry({ id: 'd-inq-3', fullName: 'Elena Rodriguez', company: 'Lumina Health', projectType: 'custom-software', budgetRange: '700k+', status: 'proposal' }, 30),
  inquiry({ id: 'd-inq-4', fullName: 'David Kim', company: 'Independent', projectType: 'ui-ux', budgetRange: 'under-100k', status: 'closed' }, 52),
  inquiry({ id: 'd-inq-5', fullName: 'Nadia Rahman', company: 'Dhaka Fresh', projectType: 'mobile-app', budgetRange: '100k-300k', status: 'new' }, 6),
  inquiry({ id: 'd-inq-6', fullName: 'Tanvir Ahmed', company: 'Meghna Traders', projectType: 'website', budgetRange: 'under-100k', status: 'new', source: 'home-cta' }, 9),
  inquiry({ id: 'd-inq-7', fullName: 'Priya Sen', company: 'Kolkata Crafts', projectType: 'wordpress', budgetRange: 'not-sure', status: 'won' }, 120),
  inquiry({ id: 'd-inq-8', fullName: 'Omar Faruk', company: 'GreenGrid IoT', projectType: 'iot', budgetRange: '300k-700k', status: 'contacted' }, 75),
];

export const demoLeads: AffiliateLead[] = [
  { id: 'd-lead-1', fullName: 'Rafiq Islam', email: 'rafiq@example.com', phone: '+880 1711-000000', message: 'I run a small agency network in Chattogram.', status: 'new', createdAt: ago(5) },
  { id: 'd-lead-2', fullName: 'Maria Lopez', email: 'maria@example.com', phone: '+34 600 000 000', message: 'Freelance consultant, two clients need apps.', status: 'contacted', createdAt: ago(40) },
  { id: 'd-lead-3', fullName: 'Arif Hasan', email: 'arif@example.com', phone: '+880 1811-000000', message: '', status: 'active', createdAt: ago(200) },
];

const application = (p: Partial<Application> & Pick<Application, 'id' | 'fullName' | 'jobSlug' | 'jobTitle' | 'stage'>, hours: number): Application => ({
  email: `${p.fullName.split(' ')[0]!.toLowerCase()}@example.com`,
  phone: '+880 1900-000000',
  location: 'Dhaka, Bangladesh',
  portfolioUrl: 'https://example.com',
  linkedinUrl: '',
  githubUrl: 'https://github.com/example',
  experienceRange: '3-5',
  primaryFramework: 'React / Next.js',
  whyUs: 'I like how you ship small, reviewed increments and keep clients close to the work.',
  interviewAt: '',
  isViewed: p.stage !== 'new',
  createdAt: ago(hours),
  ...p,
});

export const demoApplications: Application[] = [
  application({ id: 'd-app-1', fullName: 'Alice Smith', jobSlug: 'senior-frontend-engineer', jobTitle: 'Senior Frontend Engineer', stage: 'screening' }, 20),
  application({ id: 'd-app-2', fullName: 'Bob Johnson', jobSlug: 'product-designer', jobTitle: 'Product Designer', stage: 'interview', interviewAt: ahead(30) }, 44),
  application({ id: 'd-app-3', fullName: 'Carol Davis', jobSlug: 'backend-developer-intern', jobTitle: 'Backend Developer Intern', stage: 'new' }, 68),
  application({ id: 'd-app-4', fullName: 'Imran Hossain', jobSlug: 'senior-frontend-engineer', jobTitle: 'Senior Frontend Engineer', stage: 'new' }, 4),
  application({ id: 'd-app-5', fullName: 'Sadia Akter', jobSlug: 'product-designer', jobTitle: 'Product Designer', stage: 'rejected' }, 150),
];

export const demoContent: ContentItem[] = [
  { id: 'd-post-1', kind: 'post', title: 'How to plan an MVP', status: 'draft', publishedAt: '', updatedAt: ago(2), createdAt: ago(50) },
  { id: 'd-cs-1', kind: 'case-study', title: 'Chorki', status: 'scheduled', publishedAt: ahead(20), updatedAt: ago(6), createdAt: ago(90) },
  { id: 'd-post-2', kind: 'post', title: 'Why UI/UX matters', status: 'published', publishedAt: ago(700), updatedAt: ago(700), createdAt: ago(800) },
  { id: 'd-post-3', kind: 'post', title: 'Mobile app vs web app', status: 'draft', publishedAt: '', updatedAt: ago(26), createdAt: ago(80) },
  { id: 'd-cs-2', kind: 'case-study', title: 'MeghSwar Courier', status: 'published', publishedAt: ago(100), updatedAt: ago(5), createdAt: ago(400) },
  { id: 'd-cs-3', kind: 'case-study', title: 'Texas Airway Institute', status: 'published', publishedAt: ago(300), updatedAt: ago(300), createdAt: ago(500) },
];

export const demoActivity: ActivityEvent[] = [
  { id: 'd-act-1', actor: 'Jane Smith', text: 'published “Why UI/UX matters”', at: ago(2) },
  { id: 'd-act-2', actor: 'Alex Chowdhury', text: 'updated case study “MeghSwar Courier”', at: ago(5) },
  { id: 'd-act-3', actor: 'Sagor', text: 'replied to the TechFlow inquiry', at: ago(26) },
  { id: 'd-act-4', actor: 'Sarah Das', text: 'posted job “Product Designer”', at: ago(80) },
];
