import { db } from '@/db/firebase-admin';

export const getJobApplications = async () => {
  try {
    const snapshot = await db.collection('apply-jobs').get();

    const applicationsFromFirestore = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.fullName || '',
        email: data.email || '',
        coverLetter: data.coverLetter || '',
        phone: data.phone || '',
        subject: data.subject || '',
        resumeUrl: data.resumeUrl || '',
        isViewed: data.isViewed || false,
      };
    });
    return applicationsFromFirestore;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};
