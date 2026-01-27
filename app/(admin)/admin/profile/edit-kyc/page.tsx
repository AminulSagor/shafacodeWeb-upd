"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type FileState = {
  file: File | null;
  previewUrl: string | null;
};

export default function EditKycPage() {
  const router = useRouter();

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

    // optional limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB allowed");
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
    const file = e.dataTransfer.files?.[0] ?? null;
    setFile(which, file);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>, which: "front" | "back") => {
    const file = e.target.files?.[0] ?? null;
    setFile(which, file);
  };

  const handleSubmit = async () => {
    if (!front.file || !back.file) {
      toast.error("Please upload both Front & Back of your ID");
      return;
    }

    setLoading(true);
    const loadingId = toast.loading("Uploading...");

    try {
      const fd = new FormData();
      fd.append("front", front.file);
      fd.append("back", back.file);

      const res = await fetch("/api/profile/upload-kyc", {
        method: "POST",
        body: fd,
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || text || "Upload failed");
      }

      toast.dismiss(loadingId);
      toast.success(data?.message || "KYC updated successfully!");

      router.push("/admin/profile");
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
                <p className="truncate text-sm font-medium text-gray-900">
                  {state.file?.name}
                </p>
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
                <p className="text-sm font-medium text-gray-900">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-500">
                  JPG/PNG recommended • clear & readable
                </p>
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
    <div className="grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-white p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Update your KYC</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload both sides again. Status will go to pending.
          </p>
        </div>

        <div className="space-y-5">
          <DropBox title="Front side" which="front" state={front} inputRef={frontInputRef} />
          <DropBox title="Back side" which="back" state={back} inputRef={backInputRef} />

          <div className="rounded-lg border bg-slate-50 p-3 text-xs text-gray-600">
            Tip: Upload a clear photo in good lighting. No blur, no crop.
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2.5 rounded-lg w-full hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Submit & Save"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => router.back()}
              className="rounded-lg border bg-white px-4 py-2.5 w-full hover:bg-slate-50 transition disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
