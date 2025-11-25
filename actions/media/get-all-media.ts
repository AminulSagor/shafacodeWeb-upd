import { db } from '@/db/firebase-admin';

export const getAllMedia = async () => {
  try {
    const snapshot = await db.collection('media').get();

    const mediaFromFirestore = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        url: data.url || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    // sort newest → oldest
    return mediaFromFirestore.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};
