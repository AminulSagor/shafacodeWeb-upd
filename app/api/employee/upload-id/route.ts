import cloudinary from "@/lib/cloudinary";
import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const uid = String(formData.get("uid") || "").trim().toLowerCase(); // email
    const front = formData.get("front") as File | null;
    const back = formData.get("back") as File | null;

    if (!uid || !front || !back) {
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
    const userRef = doc(firebaseClient, "users", uid); // if your employees are in "users"
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

    // ✅ upload to cloudinary
    const frontUrl = await uploadOne(front, `employee-kyc/${uid}`);
    const backUrl = await uploadOne(back, `employee-kyc/${uid}`);

    // ✅ Save KYC request (your style: setDoc)
    const kycRef = doc(firebaseClient, "employeeKycRequests", uid);
    await setDoc(
      kycRef,
      {
        uid,
        role: "employee",
        status: "pending",
        frontUrl,
        backUrl,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    // ✅ Update user doc with KYC fields (your style: setDoc merge)
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
      message: "Employee ID uploaded successfully!",
      frontUrl,
      backUrl,
    });
  } catch (err: any) {
    console.error("EMPLOYEE_UPLOAD_ID_ERROR:", err);
    return Response.json({
      success: false,
      message: err?.message || "Upload failed. Try again.",
    });
  }
}
