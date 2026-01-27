import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { SOP } from "./getSOPs";

function toISO(v: any) {
  if (!v) return new Date().toISOString();

  if (v instanceof Timestamp) {
    return v.toDate().toISOString();
  }

  if (v instanceof Date) {
    return v.toISOString();
  }

  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export const getSOPById = async (id: string): Promise<SOP | null> => {
  try {
    const ref = doc(firebaseClient, "sops", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    console.log("gggg",data.history);

    return {
      id: snap.id,
      ...data,
      createdAt: toISO(data?.createdAt),
      updatedAt: toISO(data?.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching SOP by ID:", error);
    return null;
  }
};
