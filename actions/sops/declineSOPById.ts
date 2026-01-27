import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";

export const declineSOPById = async (
  id: string,
  reason: string
) => {
  try {
    const ref = doc(firebaseClient, "sops", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return {
        success: false,
        message: "SOP not found",
      };
    }

    const sop = snap.data() as any;

    const sopOwnerEmail = sop?.createdBy

    if (!sopOwnerEmail) {
      return {
        success: false,
        message: "SOP owner email missing in document",
      };
    }
    await updateDoc(ref, {
      status: "declined",
      declineReason: reason,
      declinedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "SOP declined successfully",
      sopOwnerEmail
    };
  } catch (error) {
    console.error("Decline SOP error:", error);
    return {
      success: false,
      message: "Failed to decline SOP",
    };
  }
};