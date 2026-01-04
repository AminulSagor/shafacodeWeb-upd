import { db } from "@/db/firebase-admin";
import { unstable_noStore as noStore } from "next/cache";

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  type: string;
  location: string;
  jobDescription: string;
}

export const getJobs = async () => {
  noStore();
  try {
    const snapshot = await db.collection("jobs").get();
    const jobsFromFirestore: Job[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        slug: data.slug || "",
        department: data.department || "",
        type: data.type || "",
        location: data.location || "",
        jobDescription: data.jobDescription || "",
      };
    });
    return jobsFromFirestore;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
