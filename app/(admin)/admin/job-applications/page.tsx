import { getJobApplications } from '@/actions/job-applications/get-applications';
import JobApplicationsList from '@/components/admin/job-applications/job-applications-list';
import JobList from '@/components/admin/jobs/job-list';

const JobApplicationsPage = async () => {
  const applicationsData = await getJobApplications();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Job Applications</h2>
      </div>
      <JobApplicationsList applications={applicationsData} />
    </div>
  );
};

export default JobApplicationsPage;
