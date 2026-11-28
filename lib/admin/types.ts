/** Admin DTOs: explicit fields only, safe to pass to client components. */

export const inquiryStatuses = ['new', 'contacted', 'proposal', 'won', 'closed'] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];
export type Inquiry = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  attachments: { label: string; path?: string; url?: string }[];
  source: string;
  estimate: string;
  status: InquiryStatus;
  createdAt: string;
  /** When it first left "new" (for the average first reply). */
  contactedAt: string;
};

export const leadStatuses = ['new', 'discussion', 'won', 'lost'] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export type AffiliateLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  file?: { path?: string; url?: string };
  /** Set by the team once the partner refers a project. */
  referredProject: string;
  estValue: number | null;
  partnerType: string;
  status: LeadStatus;
  createdAt: string;
};

export const applicationStages = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const;
export type ApplicationStage = (typeof applicationStages)[number];
export type Application = {
  id: string;
  jobSlug: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  experienceRange: string;
  primaryFramework: string;
  whyUs: string;
  resume?: { path?: string; url?: string };
  stage: ApplicationStage;
  /** When each stage was reached (ISO). */
  stageDates: Partial<Record<ApplicationStage, string>>;
  interviewAt: string;
  isViewed: boolean;
  createdAt: string;
};

export const publishStatuses = ['draft', 'scheduled', 'published', 'archived'] as const;
export type PublishStatus = (typeof publishStatuses)[number];

export type ContentItem = {
  id: string;
  kind: 'post' | 'case-study';
  title: string;
  status: PublishStatus;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
};

export type ActivityEvent = { id: string; actor: string; text: string; at: string };

export const inquiryStatusLabel: Record<InquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  proposal: 'Proposal',
  won: 'Won',
  closed: 'Closed',
};
export const leadStatusLabel: Record<LeadStatus, string> = { new: 'New', discussion: 'In discussion', won: 'Won', lost: 'Lost' };
export const stageLabel: Record<ApplicationStage, string> = {
  new: 'New',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};
export const publishLabel: Record<PublishStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};
