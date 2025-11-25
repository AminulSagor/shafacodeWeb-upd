'use server';

import { BlogFormValues } from '@/components/admin/blogs/create-blogs-form';
import { db } from '@/db/firebase-admin';

const createBlog = async (data: BlogFormValues) => {
  try {
    const docRef = await db.collection('blogs').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, errorMsg: 'Failed to create project' };
  }
};

export default createBlog;
