import { firebaseClient } from "@/db/firebase-client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type CreateNotificationParams = {
  title: string;
  userEmail: string;
  message: string;
  type:
    | "SOP_APPROVED"
    | "SOP_DELETED"
    | "SOP_REJECTED"
    | "SOP_PENDING"
    | string;
  target?: string;
  sopId?: string;
  sopCategory?: string;
};

export async function createNotification({
  title,
  userEmail,
  message,
  type,
  target,
  sopId,
  sopCategory
}: CreateNotificationParams) {
  if (!userEmail) return;

  const payload = {
    title,
    message,
    userEmail,
    type,
    target: target ?? null,
    sopId: sopId ?? null,
    sopCategory: sopCategory ?? null,
    isRead: false,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(firebaseClient, "notifications"), payload);
}
