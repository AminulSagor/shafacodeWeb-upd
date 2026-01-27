import cloudinary from "@/lib/cloudinary";
import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ✅ get uid from cookie (email)
    const cookieStore = await cookies();
    const uid = String(cookieStore.get("email")?.value || "")
      .trim()
      .toLowerCase();

    if (!uid) {
      return Response.json({
        success: false,
        message: "Not authenticated",
      });
    }

    const formData = await req.formData();
    const front = formData.get("front") as File | null;
    const back = formData.get("back") as File | null;

    if (!front || !back) {
      return Response.json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!front.type.startsWith("image/") || !back.type.startsWith("image/")) {
      return Response.json({
        success: false,
        message: "Only image files allowed",
      });
    }

    // ✅ employee exists? (doc id = uid)
    const userRef = doc(firebaseClient, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    const uploadOne = async (file: File, folder: string) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: "image",
              secure: true,
            },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result.secure_url);
            }
          )
          .end(buffer);
      });
    };

    const now = Date.now();

    // ✅ upload to cloudinary (same folder structure)
    const frontUrl = await uploadOne(front, `employee-kyc/${uid}`);
    const backUrl = await uploadOne(back, `employee-kyc/${uid}`);

    // ✅ Re-submit => pending again
    const kycRef = doc(firebaseClient, "employeeKycRequests", uid);
    await setDoc(
      kycRef,
      {
        uid,
        role: "employee",
        status: "pending",
        frontUrl,
        backUrl,
        updatedAt: now,
        createdAt: now, // merge true => keeps old if exists, but ok
      },
      { merge: true }
    );

    // ✅ Update employee user doc
    await setDoc(
      userRef,
      {
        kycStatus: "pending",
        kycFrontUrl: frontUrl,
        kycBackUrl: backUrl,
        kycUpdatedAt: now,
      },
      { merge: true }
    );

    return Response.json({
      success: true,
      message: "KYC updated successfully! Waiting for approval.",
      frontUrl,
      backUrl,
    });
  } catch (err: any) {
    console.error("EMPLOYEE_UPLOAD_KYC_ERROR:", err);
    return Response.json({
      success: false,
      message: err?.message || "Upload failed. Try again.",
    });
  }
}
