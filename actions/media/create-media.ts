'use server';

import { db } from '@/db/firebase-admin';

const createMedia = async (mediaUrl: { url: string }) => {
  try {
    const docRef = await db.collection('media').add({
      ...mediaUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, errorMsg: 'Failed to create project' };
  }
};

export default createMedia;
