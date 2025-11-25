'use server';
import { db } from '@/db/firebase-admin';

export const getBlogBySlug = async (slug: string) => {
  try {
    const querySnap = await db
      .collection('blogs')
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
      category: data?.category || '',
      excerpt: data?.excerpt || '',
      content: data?.content || '',
      coverImage: data?.coverImage || '',
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};
