// app/api/client/upload-id/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const uid = String(formData.get("uid") || "").trim().toLowerCase(); // email
    const front = formData.get("front") as File | null;
    const back = formData.get("back") as File | null;

    if (!uid || !front || !back) {
      return NextResponse.json({ message: "Missing required data" }, { status: 400 });
    }

    if (!front.type.startsWith("image/") || !back.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image files allowed" }, { status: 400 });
    }

    // ✅ ensure client exists
    const userRef = doc(firebaseClient, "clients", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
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

    // 🔥 Better: put both images inside one folder (more organized)
    const frontUrl = await uploadOne(front, `kyc/${uid}`);
    const backUrl = await uploadOne(back, `kyc/${uid}`);

    const now = Date.now();

    // ✅ Save KYC request
    const kycRef = doc(firebaseClient, "kycRequests", uid);
    await setDoc(
      kycRef,
      {
        uid,
        status: "pending",
        frontUrl,
        backUrl,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    // ✅ Update client (add image link fields)
    await updateDoc(userRef, {
      kycStatus: "pending",
      kycFrontUrl: frontUrl, // ✅ added
      kycBackUrl: backUrl,   // ✅ added
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "ID uploaded successfully!", frontUrl, backUrl, success: true },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("UPLOAD_ID_ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Upload failed. Try again.", success: false },
      { status: 500 }
    );
  }
}
