import { getJobApplications } from '@/actions/job-applications/get-applications';
import JobApplicationsList from '@/components/admin/job-applications/job-applications-list';

export default async function JobApplicationsLoader() {
  const applicationsData = await getJobApplications();
  return <JobApplicationsList applications={applicationsData} />;
}
