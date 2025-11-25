'use server';
import { db } from '@/db/firebase-admin';
export const getBlogs = async () => {
  try {
    const snapshot = await db.collection('blogs').get();
    const blogsFromFirestore = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category || '',
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        coverImage: data.coverImage || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    return blogsFromFirestore;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};
