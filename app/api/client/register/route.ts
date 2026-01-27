import { doc, getDoc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseClient } from "@/db/firebase-client";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    if (String(password).length < 6) {
      return Response.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();
    const cleanPhone =
      phone === null || phone === undefined || String(phone).trim() === ""
        ? null
        : String(phone).trim();

    // ✅ your style: doc id = email
    const userRef = doc(firebaseClient, "clients", cleanEmail);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return Response.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    await setDoc(userRef, {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone, // ✅ optional
      password: hashedPassword,
      role: "client",
      verified: true,
      kycStatus: "not_submitted",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return Response.json({ message: "Account created", uid: cleanEmail }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Register failed" }, { status: 500 });
  }
}
