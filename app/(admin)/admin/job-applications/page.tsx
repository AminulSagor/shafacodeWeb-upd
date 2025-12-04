import JobApplicationsLoader from '@/components/admin/job-applications/job-applications-loader';
import JobApplicationsSkeleton from '@/components/shared/loading-skeleton-table';
import { Suspense } from 'react';

const JobApplicationsPage = async () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Job Applications</h2>
      </div>
      <Suspense fallback={<JobApplicationsSkeleton />}>
        <JobApplicationsLoader />
      </Suspense>
    </div>
  );
};

export default JobApplicationsPage;
