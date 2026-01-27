import { collection, addDoc } from "firebase/firestore";
import { firebaseClient } from "@/db/firebase-client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { procedureSteps, category, status } = await req.json();

    const cookieStore = await cookies();
    const createdBy = cookieStore.get("email")?.value;

    if (!procedureSteps || !procedureSteps.length) {
      return Response.json({
        success: false,
        message: "Procedure steps are required",
      });
    }

    const sopRef = await addDoc(collection(firebaseClient, "sops"), {
      procedureSteps,
      category: category,
      status: status || "pending",
      createdBy: createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return Response.json({
      createdBy,
      success: true,
      message: "SOP saved successfully",
      id: sopRef.id,
      procedureSteps: procedureSteps,
      sopCategory: category,
    });
  } catch (err: any) {
    console.error("Error saving SOP:", err);
    return Response.json({
      success: false,
      message: err.message || "Failed to save SOP",
    });
  }
}
