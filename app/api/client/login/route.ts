import { cookies } from "next/headers";
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseClient } from "@/db/firebase-client";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  try {
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      return Response.json({
        success: false,
        message: "Missing email or password",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 🔹 clients collection
    const clientsRef = collection(firebaseClient, "clients");
    const q = query(clientsRef, where("email", "==", cleanEmail));
    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      return Response.json({ success: false, message: "Client not found" });
    }

    const clientSnap = querySnap.docs[0];
    const client = clientSnap.data();

    // 🔐 password check
    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return Response.json({ success: false, message: "Invalid credentials" });
    }

    // 🍪 cookies (client auth)
    cookieStore.set("client_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookieStore.set("client_email", cleanEmail, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("client_role", "client", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Client login error:", err);
    return Response.json({
      success: false,
      message: "Internal server error",
    });
  }
}
