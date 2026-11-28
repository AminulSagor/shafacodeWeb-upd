import CreateJobForm from '@/components/admin/jobs/create-job-form';
import CreateProjectForm from '@/components/admin/projects/create-project-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CreateJobsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Create Jobs</h2>
        <Button asChild>
          <Link href="/admin/jobs">Go Back</Link>
        </Button>
      </div>
      <CreateJobForm />
    </div>
  );
};

export default CreateJobsPage;
