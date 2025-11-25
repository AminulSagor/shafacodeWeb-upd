import { db } from '@/db/firebase-admin';

export const getBlogById = async (id: string) => {
  try {
    const docRef = db.collection('blogs').doc(id); // reference to a single doc
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // document not found
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      title: data?.title || '',
      slug: data?.slug || '',
      category: data?.category || '',
      excerpt: data?.excerpt || '',
      content: data?.content || '',
      coverImage: data?.coverImage || '',
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};
