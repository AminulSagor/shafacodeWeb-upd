'use server';

import { BlogFormValues } from '@/components/admin/blogs/create-blogs-form';
import { db } from '@/db/firebase-admin';

export async function updateBlog(id: string, payload: BlogFormValues) {
  try {
    await db
      .collection('blogs')
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
