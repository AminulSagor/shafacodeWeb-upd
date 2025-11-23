'use server';

import { JobFormValues } from '@/components/admin/jobs/edit-job-form';
import { db } from '@/db/firebase-admin';

export async function updateJob(id: string, data: JobFormValues) {
  const payload = {
    title: data.title,
    slug: data.slug,
    department: data.department,
    type: data.type,
    location: data.location,
    jobDescription: data.jobDescription,
  };

  try {
    await db
      .collection('jobs')
      .doc(id)
      .update({
        ...payload,
      });
    return { success: true, message: 'Project updated successfully' };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}
