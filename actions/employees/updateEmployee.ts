import { firebaseClient } from "@/db/firebase-client";
import { doc, updateDoc } from "firebase/firestore";
import type { Employee } from "./getEmployee";

export const updateEmployee = async (email: string, patch: Partial<Employee>) => {
  const ref = doc(firebaseClient, "users", email);
  await updateDoc(ref, patch as any);
};
