import { firebaseClient } from "@/db/firebase-client";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteSOPById = async (id: string) => {
  try {
    const ref = doc(firebaseClient, "sops", id);
    await deleteDoc(ref);

    return { success: true, message: "SOP deleted successfully" };
  } catch (error) {
    console.error("Delete SOP error:", error);
    return { success: false, message: "Failed to delete SOP" };
  }
};
