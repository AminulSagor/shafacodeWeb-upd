import { Card, CardContent } from '@/components/ui/card';
import { Inbox, Calendar, Image, Building2, FileText, EthernetPort } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

const routes = [
  {
    title: 'Projects',
    description:
      'Manage portfolio projects — add, update, or remove showcased work.',
    url: '/admin/projects',
    icon: Inbox,
  },
  {
    title: 'Blogs',
    description:
      'Create and manage blog posts, write content, and update articles.',
    url: '/admin/blogs',
    icon: Calendar,
  },
  {
    title: 'Media Library',
    description:
      'All uploaded images and assets stored in Supabase. Copy URLs easily.',
    url: '/admin/media',
    icon: Image,
  },
  {
    title: 'SOP',
    description:
      'Manage and update the standard operating procedures for various processes.',
    url: '/admin/sop',
    icon: EthernetPort,
  },
  {
    title: 'Jobs',
    description:
      'Create and manage open job positions listed in the careers page.',
    url: '/admin/jobs',
    icon: Building2,
  },
  {
    title: 'Job Applications',
    description:
      'View applications submitted by candidates applying for open roles.',
    url: '/admin/job-applications',
    icon: FileText,
  },
];

export default async function AdminPage() {

  const cookie = await cookies()

  const auth = cookie.get('admin_auth');
  const role = cookie.get('role')?.value;
  const email = cookie.get('email')?.value;

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome to the Admin Panel {role ? `- ${role}` : ''} {email ? `- ${email}` : ''}
        </h1>
        <p className="mt-3 text-slate-600 text-lg max-w-2xl mx-auto">
          This dashboard gives you control over your website content, media, job
          postings, and applications. Use the quick navigation below to jump
          into each section.
        </p>
      </div>

      {/* Route Map */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link key={route.url} href={route.url}>
              <Card className="group cursor-pointer hover:shadow-lg transition">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-sky-600 group-hover:text-sky-700 transition" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      {route.title}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600">{route.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
