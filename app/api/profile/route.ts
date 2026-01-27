import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("email")?.value;

   

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const ref = doc(firebaseClient, "users", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: snap.id, ...snap.data() },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
