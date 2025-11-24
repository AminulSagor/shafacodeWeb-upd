import { db } from '@/db/firebase-admin';

export const getApplicationById = async (id: string) => {
  try {
    const docRef = db.collection('apply-jobs').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // document not found
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      name: data?.fullName || '',
      email: data?.email || '',
      coverLetter: data?.coverLetter || '',
      phone: data?.phone || '',
      subject: data?.subject || '',
      resumeUrl: data?.resumeUrl || '',
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};
