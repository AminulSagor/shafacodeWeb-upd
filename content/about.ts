import type { LucideIcon } from 'lucide-react';
import { Eye, Heart, ShieldCheck, Zap } from 'lucide-react';

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedinUrl?: string;
  email?: string;
};

export const aboutStats = [
  { value: '120', unit: '+', label: 'Projects delivered' },
  { value: '8', unit: '+', label: 'Years building' },
  { value: '14', unit: '', label: 'Countries served' },
  { value: '99', unit: '%', label: 'Client satisfaction' },
];

export const values: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Eye, title: 'Transparency', body: 'Every milestone, decision and update stays clear.' },
  { icon: ShieldCheck, title: 'Ownership', body: 'Every team member owns quality and delivery.' },
  { icon: Zap, title: 'Proactive culture', body: 'We flag problems before they become delays.' },
  { icon: Heart, title: 'Long-term partnership', body: 'Relationships, not one-time projects.' },
];

export const methodology = [
  'Clear communication',
  'Design-first thinking',
  'Clean development',
  'Weekly updates',
  'Respect for deadlines',
  'Support after launch',
];

/**
 * Seed team from the Figma frame, shown until the `team` collection has
 * visible members. Placeholders except Sagor (real photo still to add).
 */
export const fallbackTeam: TeamMember[] = [
  { name: 'Sagor', role: 'CEO & Founder', bio: 'Architects resilient systems and keeps delivery transparent.', photo: null, linkedinUrl: 'https://www.linkedin.com/company/shafacodedotcom/' },
  { name: 'Jane Smith', role: 'Head of Design', bio: 'User-centric interfaces and robust design systems.', photo: '/images/team/jane.jpg' },
  { name: 'Alex Chen', role: 'Lead Developer', bio: 'Backend, cloud and the code review culture.', photo: '/images/team/alex.jpg' },
  { name: 'Sarah Davis', role: 'Product Manager', bio: 'Agile delivery and clear client communication.', photo: '/images/team/sarah.jpg' },
];
