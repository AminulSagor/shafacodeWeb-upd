import { firebaseClient } from "@/db/firebase-client";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Employee } from "./getEmployee";

const toMs = (v: any) => (typeof v?.toMillis === "function" ? v.toMillis() : v);

export const getEmployees = async (): Promise<Employee[]> => {
  const q = query(collection(firebaseClient, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data: any = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: toMs(data.createdAt),
      kycUpdatedAt: toMs(data.kycUpdatedAt),
      firedAt: toMs(data.firedAt),
    } as Employee;
  });
};
