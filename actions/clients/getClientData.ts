import { cookies } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";

export async function getClientServer() {
  const cookieStore = await cookies();
  const email = cookieStore.get("client_email")?.value;

  if (!email) return null;

  const ref = doc(firebaseClient, "clients", email);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}
