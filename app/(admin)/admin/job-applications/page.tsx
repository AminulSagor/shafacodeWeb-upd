import CategoryLoader from "@/components/admin/job-applications/category-loader";
import FilterByCategory from "@/components/admin/job-applications/filter-by-category";
import JobApplicationsLoader from "@/components/admin/job-applications/job-applications-loader";
import JobApplicationsSkeleton from "@/components/shared/loading-skeleton-table";
import { Suspense } from "react";

const JobApplicationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter_by?: string }>;
}) => {
  const params = await searchParams;
  const { filter_by } = params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Job Applications</h2>
        <Suspense
          fallback={
            <div className="inline-block h-8 w-[180px] bg-gray-200 animate-pulse rounded" />
          }
        >
          <CategoryLoader />
        </Suspense>
      </div>
      <Suspense fallback={<JobApplicationsSkeleton />}>
        <JobApplicationsLoader filterBy={filter_by} />
      </Suspense>
    </div>
  );
};

export default JobApplicationsPage;
