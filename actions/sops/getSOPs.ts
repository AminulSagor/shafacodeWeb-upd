import { db } from "@/db/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export interface SOP {
  id: string;
  title?: string;
  category?: string;
  status?: "pending" | "active" | "declined";
  createdBy?: string;
  procedureSteps?: string;
  history?: Array<{ action: string; timestamp: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export const getSOPs = async (): Promise<SOP[]> => {
  try {
    const snapshot = await db.collection("sops").get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();

      const updatedAt =
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : new Date().toISOString();

      return {
        id: doc.id,
        title: data.title ?? "",
        category: data.category ?? "",
        status: data.status ?? "pending",
        procedureSteps: data.procedureSteps ?? "",
        createdBy: data.createdBy ?? "",
        history: data.history ?? [],
        createdAt,
        updatedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching SOPs:", error);
    return [];
  }
};
