import { getJobById } from '@/actions/jobs/get-job-by-id';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const job = await getJobById(slug);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Job Details</h2>
        <Button asChild>
          <Link href="/admin/jobs">Go Back</Link>
        </Button>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent className="capitalize">{job?.title}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Department</CardTitle>
          </CardHeader>
          <CardContent className="capitalize">{job?.department}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Type</CardTitle>
          </CardHeader>
          <CardContent>{job?.type}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>{job?.location}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="prose  max-w-full">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {job?.jobDescription}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPage;
