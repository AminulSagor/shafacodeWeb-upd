import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";

interface UpdateSOPPayload {
  title?: string;
  procedureSteps?: string;
  status?: "pending" | "active";
}

export const updateSOPById = async (
  id: string,
  updatedData: UpdateSOPPayload,
  meta?: {
    by?: string;
    prev?: {
      title?: string;
      procedureSteps?: string;
      status?: string;
    };
  }
) => {
  try {
    const ref = doc(firebaseClient, "sops", id);

    const changes: any = {};

    if (meta?.prev?.procedureSteps !== undefined && updatedData.procedureSteps !== undefined) {
      if (meta.prev.procedureSteps !== updatedData.procedureSteps) {
        changes.procedureSteps = {
          from: meta.prev.procedureSteps,
          to: updatedData.procedureSteps,
        };
      }
    }

    if (meta?.prev?.status !== undefined && updatedData.status !== undefined) {
      if (meta.prev.status !== updatedData.status) {
        changes.status = { from: meta.prev.status, to: updatedData.status };
      }
    }

    if (meta?.prev?.title !== undefined && updatedData.title !== undefined) {
      if (meta.prev.title !== updatedData.title) {
        changes.title = { from: meta.prev.title, to: updatedData.title };
      }
    }

    await updateDoc(ref, {
      ...updatedData,
      updatedAt: Date.now(),
      history: arrayUnion({
        action: "UPDATED",
        by: meta?.by || "unknown",
        at: Date.now(),
        changes: Object.keys(changes).length ? changes : null,
      }),
    });

    return { success: true, message: "SOP updated successfully" };
  } catch (error) {
    console.error("Update SOP error:", error);
    return { success: false, message: "Failed to update SOP" };
  }
};
