import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";

export const approveSOPById = async (id: string) => {
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
      status: "active",
    });

    return {
      success: true,
      message: "SOP approved successfully",
      sopOwnerEmail,
    };
  } catch (error) {
    console.error("Approve SOP error:", error);
    return {
      success: false,
      message: "Failed to approve SOP",
    };
  }
};
