import { db } from "@/db/firebase-admin";

export async function getNotifications(target: string) {
  if (!target) return [];

  const snap = await db
    .collection("notifications")
    .where("target", "==", target)
    .get();

  const list = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
    };
  });

  list.sort((a, b) => {
    const at = a.createdAt ? a.createdAt.getTime() : 0;
    const bt = b.createdAt ? b.createdAt.getTime() : 0;
    return bt - at;
  });

  return list.map((n) => ({
    ...n,
    createdAt: n.createdAt ? n.createdAt.toISOString() : null,
  }));
}
