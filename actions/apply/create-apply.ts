'use server';
import { db } from '@/db/firebase-admin';

const createApply = async (payload: any) => {
  try {
    const docRef = await db.collection('apply-jobs').add(payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, errorMsg: 'Failed to create project' };
  }
};

export default createApply;
