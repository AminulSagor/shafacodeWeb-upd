import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const JobsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Jobs</h2>
        <Button className="hover:cursor-pointer" asChild>
          <Link href={'/admin/jobs/create'}>Create Job</Link>
        </Button>
      </div>
    </div>
  );
};

export default JobsPage;
