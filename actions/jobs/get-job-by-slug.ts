import { db } from '@/db/firebase-admin';

export const getJobBySlug = async (slug: string) => {
  try {
    const querySnap = await db
      .collection('jobs')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (querySnap.empty) {
      return null; // no job found with this slug
    }

    const doc = querySnap.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      title: data?.title || '',
      slug: data?.slug || '',
      department: data?.department || '',
      type: data?.type || '',
      location: data?.location || '',
      jobDescription: data?.jobDescription || '',
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};
