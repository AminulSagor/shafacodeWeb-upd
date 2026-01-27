import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc } from "firebase/firestore";

export const getProfile = async (userId: string) => {
  const ref = doc(firebaseClient, "users", userId); // or "employees"
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
};
