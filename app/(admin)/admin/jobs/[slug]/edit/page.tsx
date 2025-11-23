import { getJobById } from '@/actions/jobs/get-job-by-id';
import EditJobForm from '@/components/admin/jobs/edit-job-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const EditJobPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const job = await getJobById(slug);

  const id = job?.id;
  const title = job?.title;
  const jobDescription = job?.jobDescription;
  const department = job?.department;
  const type = job?.type;
  const location = job?.location;
  const s = job?.slug;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Update Jobs</h2>
        <Button asChild>
          <Link href="/admin/jobs">Go Back</Link>
        </Button>
      </div>

      <EditJobForm
        id={id!}
        title={title}
        jobDescription={jobDescription}
        department={department}
        type={type}
        location={location}
        slug={s}
      />
    </div>
  );
};

export default EditJobPage;
