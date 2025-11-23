'use server';
import { JobFormValues } from '@/components/admin/jobs/create-job-form';
import { db } from '@/db/firebase-admin';
import capitalizeWords from '@/helper/capitalized-words';
const createJob = async (job: JobFormValues) => {
  const payload = {
    title: capitalizeWords(job.title),
    slug: job.slug,
    department: job.department,
    type: job.type,
    location: job.location,
    jobDescription: job.jobDescription,
  };

  try {
    const docRef = await db.collection('jobs').add(payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, errorMsg: 'Failed to create project' };
  }
};

export default createJob;
