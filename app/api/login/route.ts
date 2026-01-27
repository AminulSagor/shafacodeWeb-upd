import { cookies } from "next/headers";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseClient } from "@/db/firebase-client";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const form = await req.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  if (!username || !password) {
    return Response.json({
      success: false,
      message: "Missing username or password",
    });
  }

  try {
    const usersRef = collection(firebaseClient, "users");

    const q = query(usersRef, where("username", "==", username));
    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      return Response.json({ success: false, message: "User not found" });
    }

    const userSnap = querySnap.docs[0];
    const user = userSnap.data();

    if (!user.verified) {
      return Response.json({ success: false, message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ success: false, message: "Invalid credentials" });
    }

    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, 
    });
    cookieStore.set("role", user.role, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, 
    });
    cookieStore.set("email", user.email, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    return Response.json({ success: true, message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Internal server error" });
  }
}
