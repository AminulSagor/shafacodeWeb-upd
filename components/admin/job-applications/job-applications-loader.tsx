import { getJobApplications } from "@/actions/job-applications/get-applications";
import JobApplicationsList from "@/components/admin/job-applications/job-applications-list";

export default async function JobApplicationsLoader({ filterBy }: any) {
  const applicationsData = await getJobApplications();

  const dataToShow = filterBy
    ? applicationsData.filter((data) => data.slug === filterBy)
    : applicationsData;

  return <JobApplicationsList applications={dataToShow} />;
}
