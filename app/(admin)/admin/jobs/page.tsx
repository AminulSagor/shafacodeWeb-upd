import { getJobs } from '@/actions/jobs/get-jobs';
import JobList from '@/components/admin/jobs/job-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const JobsPage = async () => {
  const data = await getJobs();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Jobs</h2>
        <Button className="hover:cursor-pointer" asChild>
          <Link href={'/admin/jobs/create'}>Create Job</Link>
        </Button>
      </div>
      <JobList jobs={data} />
    </div>
  );
};

export default JobsPage;
