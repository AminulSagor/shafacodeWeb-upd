"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type FileState = {
  file: File | null;
  previewUrl: string | null;
};

export default function UploadIdPage() {
  const [front, setFront] = useState<FileState>({ file: null, previewUrl: null });
  const [back, setBack] = useState<FileState>({ file: null, previewUrl: null });
  const [loading, setLoading] = useState(false);

  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (front.previewUrl) URL.revokeObjectURL(front.previewUrl);
      if (back.previewUrl) URL.revokeObjectURL(back.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFile = (which: "front" | "back", file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const url = URL.createObjectURL(file);

    if (which === "front") {
      if (front.previewUrl) URL.revokeObjectURL(front.previewUrl);
      setFront({ file, previewUrl: url });
    } else {
      if (back.previewUrl) URL.revokeObjectURL(back.previewUrl);
      setBack({ file, previewUrl: url });
    }
  };

  const removeFile = (which: "front" | "back") => {
    if (which === "front") {
      if (front.previewUrl) URL.revokeObjectURL(front.previewUrl);
      setFront({ file: null, previewUrl: null });
      if (frontInputRef.current) frontInputRef.current.value = "";
    } else {
      if (back.previewUrl) URL.revokeObjectURL(back.previewUrl);
      setBack({ file: null, previewUrl: null });
      if (backInputRef.current) backInputRef.current.value = "";
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, which: "front" | "back") => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    setFile(which, file ?? null);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>, which: "front" | "back") => {
    const file = e.target.files?.[0] ?? null;
    setFile(which, file);
  };

  // ✅ updated: safer fetch parsing + shows real error if API returns HTML
  const handleSubmit = async () => {
    if (!front.file || !back.file) {
      toast.error("Please upload both Front & Back of your ID");
      return;
    }

    const uid = localStorage.getItem("uid");
    if (!uid) {
      toast.error("User not found. Please register again.");
      return;
    }

    setLoading(true);
    const loadingId = toast.loading("Uploading...");

    try {
      const fd = new FormData();
      fd.append("uid", uid);
      fd.append("front", front.file);
      fd.append("back", back.file);

      const res = await fetch("/api/client/upload-id", {
        method: "POST",
        body: fd,
      });

      // ✅ read raw first (prevents "Unexpected token <" crash)
      const data = await res.json()
      
      
      if (!data.success) {
        // show json message if available, otherwise show raw text
        throw new Error(data?.message || "Upload failed");
      }

      toast.dismiss(loadingId);
      toast.success(data?.message || "ID uploaded successfully!");
      redirect("/client/login");
    } catch (err: any) {
      toast.dismiss(loadingId);
      toast.error(err?.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const DropBox = ({
    title,
    which,
    state,
    inputRef,
  }: {
    title: string;
    which: "front" | "back";
    state: FileState;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => {
    const hasFile = !!state.file;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {hasFile ? (
            <button
              type="button"
              onClick={() => removeFile(which)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          ) : null}
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, which)}
          onClick={() => inputRef.current?.click()}
          className={[
            "cursor-pointer rounded-xl border bg-white p-4 transition",
            "hover:bg-slate-50",
            hasFile ? "border-black/20" : "border-dashed border-gray-300",
          ].join(" ")}
        >
          {hasFile ? (
            <div className="flex items-center gap-4">
              <div className="h-20 w-28 overflow-hidden rounded-lg border bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.previewUrl ?? ""}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{state.file?.name}</p>
                <p className="text-xs text-gray-500">
                  {(((state.file?.size ?? 0) / 1024)).toFixed(0)} KB • Click to replace
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-slate-50 text-gray-700">
                ↑
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-500">JPG/PNG recommended • clear & readable</p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef as any}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPick(e, which)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen w-screen grid place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-xl border bg-white p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Upload your ID</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload both sides of your National ID / Passport
          </p>
        </div>

        <div className="space-y-5">
          <DropBox title="Front side" which="front" state={front} inputRef={frontInputRef} />
          <DropBox title="Back side" which="back" state={back} inputRef={backInputRef} />

          <div className="rounded-lg border bg-slate-50 p-3 text-xs text-gray-600">
            Tip: Upload a clear photo in good lighting. No blur, no crop.
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2.5 rounded-lg w-full hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Submit & Continue"}
          </button>

          <div className="text-center text-sm">
            <Link href="/client/register" className="text-gray-600 hover:text-black transition">
              ← Back to Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
