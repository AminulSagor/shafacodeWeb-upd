import { getApplicationById } from '@/actions/job-applications/get-applications-by-id';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mail, Phone, FileText } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const app = await getApplicationById(id);

  if (!app) {
    return <div className="p-10 text-red-500">Application not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Application Details</h2>
        <Button asChild>
          <Link href="/admin/job-applications">Go Back</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Applicant Name */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Name</CardTitle>
          </CardHeader>
          <CardContent className="capitalize">{app.name}</CardContent>
        </Card>

        {/* Subject */}
        <Card>
          <CardHeader>
            <CardTitle>Subject</CardTitle>
          </CardHeader>
          <CardContent>{app.subject}</CardContent>
        </Card>

        {/* Resume */}
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={app.resumeUrl}
              target="_blank"
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md"
            >
              <FileText size={16} />
              View Resume
            </a>

            <iframe
              src={app.resumeUrl}
              className="w-full h-[800px] border rounded-md"
            ></iframe>
          </CardContent>
        </Card>
      </div>

      {/* Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Letter</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-full">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {app.coverLetter}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href={`mailto:${app.email}`}
            className="flex items-center gap-2 text-blue-600 underline"
          >
            <Mail size={16} />
            {app.email}
          </a>
        </CardContent>
      </Card>

      {/* Phone */}
      <Card>
        <CardHeader>
          <CardTitle>Phone</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href={`tel:${app.phone}`}
            className="flex items-center gap-2 text-blue-600 underline"
          >
            <Phone size={16} />
            {app.phone}
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
