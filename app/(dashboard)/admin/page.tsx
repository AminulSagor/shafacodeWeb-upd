import type { Metadata } from 'next';
import { Download, FileText, Folder, Inbox, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/admin/dashboard/kpi-card';
import { CreateMenu } from '@/components/admin/shell/create-menu';
import { ActivityFeed, ContentQueue, LeadPipeline, RecentApplications, RecentInquiries } from '@/components/admin/dashboard/sections';
import { PageHeader } from '@/components/admin/ui/page-header';
import { recentActivity } from '@/lib/admin/activity';
import { listContentSummary } from '@/lib/admin/content';
import { formatLongDate } from '@/lib/admin/format';
import { listApplications, listInquiries } from '@/lib/admin/pipeline';
import { startOfMonth, startOfToday } from '@/lib/admin/source';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Dashboard' };

function greeting(now: Date) {
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dhaka' }).format(now));
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

/** Admin dashboard. Figma: Dashboard 55:2655 (mobile 62:9506) */
export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [inquiries, applications, content, activity] = await Promise.all([
    listInquiries(),
    listApplications(),
    listContentSummary(),
    recentActivity(4),
  ]);

  const now = new Date();
  const today = startOfToday().toISOString();
  const yesterday = new Date(startOfToday().getTime() - 86_400_000).toISOString();
  const month = startOfMonth().toISOString();

  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const todayCount = inquiries.filter((i) => i.createdAt >= today).length;
  const yesterdayCount = inquiries.filter((i) => i.createdAt >= yesterday && i.createdAt < today).length;
  const unread = applications.filter((a) => !a.isViewed).length;
  const caseStudies = content.filter((c) => c.kind === 'case-study' && c.status === 'published');
  const posts = content.filter((c) => c.kind === 'post');
  const drafts = posts.filter((p) => p.status === 'draft').length;

  const queue = [
    ...content.filter((c) => c.status === 'draft').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 1),
    ...content.filter((c) => c.status === 'scheduled').sort((a, b) => a.publishedAt.localeCompare(b.publishedAt)).slice(0, 1),
    ...content.filter((c) => c.status === 'published').sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 1),
  ];

  const by = (s: string) => inquiries.filter((i) => i.status === s).length;
  const pipeline = [
    { label: 'New', value: by('new'), href: '/admin/inquiries?status=new' },
    { label: 'Contacted', value: by('contacted'), href: '/admin/inquiries?status=contacted' },
    { label: 'Proposal sent', value: by('proposal'), href: '/admin/inquiries?status=proposal' },
    {
      label: 'Won this month',
      value: inquiries.filter((i) => i.status === 'won' && i.createdAt >= month).length,
      href: '/admin/inquiries?status=won',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting(now)}, ${admin.name.split(' ')[0]}`}
        description={`${formatLongDate(now)} · Here is what changed since yesterday.`}
        actions={
          <>
            <Button asChild variant="secondary">
              <a href="/admin/export/inquiries" download>
                <Download aria-hidden /> Export report
              </a>
            </Button>
            <CreateMenu />
          </>
        }
      />

      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="New inquiries" value={newInquiries.length} icon={Inbox} delta={`+${todayCount} today`} note={`${yesterdayCount} yesterday`} />
        <KpiCard label="Job applications" value={applications.length} icon={User} delta={`${unread} unread`} note="needs review" tone={unread ? 'warning' : 'neutral'} />
        <KpiCard
          label="Published case studies"
          value={caseStudies.length}
          icon={Folder}
          delta={`+${caseStudies.filter((c) => c.publishedAt >= month).length}`}
          note="this month"
        />
        <KpiCard label="Blog posts" value={posts.length} icon={FileText} delta={`${drafts} drafts`} note="in progress" tone="neutral" />
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_--spacing(100)]">
        <div className="flex min-w-0 flex-col gap-4">
          <RecentInquiries items={inquiries.slice(0, 4)} />
          <RecentApplications items={applications.slice(0, 3)} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <LeadPipeline rows={pipeline} />
          <ContentQueue items={queue} />
          <ActivityFeed events={activity} />
        </div>
      </div>
    </div>
  );
}
