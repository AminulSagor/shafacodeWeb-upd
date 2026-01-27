import { firebaseClient } from "@/db/firebase-client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { use } from "react";

export const getUsersByPosition = async (position: string) => {
  const q = query(
    collection(firebaseClient, "users"),
    where("position", "==", position) 
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    username: doc.data().username,
    ...doc.data(),
  }));
};
