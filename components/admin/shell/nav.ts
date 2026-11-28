import {
  Briefcase,
  FileText,
  Folder,
  Image as ImageIcon,
  Inbox,
  LayoutGrid,
  Percent,
  Settings2,
  Star,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type CountKey = 'inquiries' | 'affiliateLeads' | 'applications';
export type NavItem = { href: string; label: string; icon: LucideIcon; count?: CountKey; exact?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

/** Admin navigation. Figma: Sidebar in Dashboard 55:2655 */
export const adminNav: NavGroup[] = [
  { label: 'Overview', items: [{ href: '/admin', label: 'Dashboard', icon: LayoutGrid, exact: true }] },
  {
    label: 'Pipeline',
    items: [
      { href: '/admin/inquiries', label: 'Contact Inquiries', icon: Inbox, count: 'inquiries' },
      { href: '/admin/affiliate-leads', label: 'Affiliate Leads', icon: Percent, count: 'affiliateLeads' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/case-studies', label: 'Case Studies', icon: Folder },
      { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    ],
  },
  {
    label: 'Recruitment',
    items: [
      { href: '/admin/jobs', label: 'Job Roles', icon: Briefcase },
      { href: '/admin/applications', label: 'Applications', icon: User, count: 'applications' },
    ],
  },
  {
    label: 'Agency',
    items: [
      { href: '/admin/team', label: 'Team Members', icon: Users },
      { href: '/admin/settings', label: 'Site Settings', icon: Settings2 },
    ],
  },
];

export const createLinks = [
  { href: '/admin/case-studies/new', label: 'Case study' },
  { href: '/admin/blogs/new', label: 'Blog post' },
  { href: '/admin/jobs/new', label: 'Job role' },
  { href: '/admin/testimonials/new', label: 'Testimonial' },
  { href: '/admin/team/new', label: 'Team member' },
];

export function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Group and item for a path, for breadcrumbs. */
export function locate(pathname: string) {
  for (const group of adminNav) {
    const item = group.items.find((i) => isActive(i, pathname));
    if (item) return { group, item };
  }
  return null;
}
