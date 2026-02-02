import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { firebaseClient } from "@/db/firebase-client";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const uid = String(formData.get("uid") || "").trim().toLowerCase(); // email
    const avatar = formData.get("avatar") as File | null;

    if (!uid || !avatar) {
      return NextResponse.json(
        { message: "Missing required data", success: false },
        { status: 400 }
      );
    }

    if (!avatar.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files allowed", success: false },
        { status: 400 }
      );
    }

    // ✅ ensure client exists
    const userRef = doc(firebaseClient, "clients", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
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
              transformation: [
                { width: 512, height: 512, crop: "fill", gravity: "face" }, // ✅ nice avatar crop
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result.secure_url);
            }
          )
          .end(buffer);
      });
    };

    const avatarUrl = await uploadOne(avatar, `clients/${uid}/avatar`);
    const now = Date.now();

    // ✅ Update client doc
    await updateDoc(userRef, {
      avatarUrl,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Avatar updated", success: true, avatarUrl },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("UPLOAD_AVATAR_ERROR:", err);
    return NextResponse.json(
      { message: err?.message || "Upload failed. Try again.", success: false },
      { status: 500 }
    );
  }
}
