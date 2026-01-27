import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc } from "firebase/firestore";

export type Employee = {
  id: string; // doc id (email)
  username?: string;
  email?: string;
  role?: string;
  position?: string;
  phone?: string;
  verified?: boolean;

  kycStatus?: string;
  kycFrontUrl?: string;
  kycBackUrl?: string;
  kycUpdatedAt?: number;

  createdAt?: number;

  isActive?: boolean;
  firedAt?: number;
};

const toMs = (v: any) => (typeof v?.toMillis === "function" ? v.toMillis() : v);

export const getEmployee = async (email: string): Promise<Employee | null> => {
  const ref = doc(firebaseClient, "users", email); 
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data: any = snap.data();

  return {
    id: snap.id,
    ...data,
    createdAt: toMs(data.createdAt),
    kycUpdatedAt: toMs(data.kycUpdatedAt),
    firedAt: toMs(data.firedAt),
  };
};
