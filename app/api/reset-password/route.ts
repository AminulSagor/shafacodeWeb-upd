import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseClient } from "@/db/firebase-client";

export async function POST(req: Request) {
  try {
    const { email, newPassword, confirmPassword } = await req.json();

    if (!email || !newPassword || !confirmPassword) {
      return Response.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return Response.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const usersRef = collection(firebaseClient, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(firebaseClient, "users", userDoc.id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateDoc(userRef, {
      password: hashedPassword,
      updatedAt: Date.now(),
    });

    return Response.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: "Password reset failed",
    });
  }
}
