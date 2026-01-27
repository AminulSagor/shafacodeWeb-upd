
import { doc, setDoc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseClient } from "@/db/firebase-client";

export async function POST(req: Request) {
  try {
    const { username, email, password,position, role } = await req.json();

    if (!username || !email || !password) {
      return Response.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const userRef = doc(firebaseClient, "users", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return Response.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await setDoc(userRef, {
      username,
      email,
      role,
      position,
      kycStatus: "not_submitted",
      password: hashedPassword,
      verified: true,
      createdAt: Date.now(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: "Verification failed",
    });
  }
}
