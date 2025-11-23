import { db } from '@/db/firebase-admin';

export const getJobById = async (id: string) => {
  try {
    const docRef = db.collection('jobs').doc(id); // reference to a single doc
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // document not found
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      title: data?.title || '',
      slug: data?.slug || '',
      department: data?.department || '',
      type: data?.type || '',
      location: data?.location || '',
      jobDescription: data?.jobDescription || '',
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};
