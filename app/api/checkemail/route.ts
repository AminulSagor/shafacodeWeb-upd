import { doc, getDoc } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({
        success: false,
        message: "Email is required",
      });
    }

    const userRef = doc(firebaseClient, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return Response.json({
        success: false,
        exists: false,
        message: "User not exists",
      });
    }
 
    return Response.json({
      success: true,
      exists: true,
      message: "User exists",
      user: {
        id: userSnap.id,
        ...userSnap.data(),
      },
    });

  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
