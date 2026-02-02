"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  FolderKanban,
  User,
  CreditCard,
  XCircle,
  BadgeCheck,
  Camera,
} from "lucide-react";
import { useClient } from "@/context/ClientContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { client, setClient } = useClient();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const item = (href: string, label: string, Icon: any) => {
    const active = pathname === href || pathname.startsWith(href);

    return (
      <Link
        href={href}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
        )}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  const safeClient = client;
  if (!safeClient) return null;

  const safeName = (safeClient.name || "Client").trim();
  const firstName = useMemo(() => {
    const parts = safeName.split(" ").filter(Boolean);
    return parts[0] || safeName;
  }, [safeName]);

  const avatarSrc =
    previewUrl ||
    (safeClient.avatarUrl && safeClient.avatarUrl.trim()
      ? safeClient.avatarUrl
      : "/client.svg");

  const openFilePicker = () => fileRef.current?.click();

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Max file size 3MB");
      return;
    }

    // ✅ instant preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // ✅ optimistic UI update
    setClient?.({ ...safeClient, avatarUrl: localUrl });

    try {
      setUploading(true);
      const loadingId = toast.loading("Uploading photo...");

      const form = new FormData();
      form.append("uid", safeClient.email); // doc id is email
      form.append("avatar", file);

      const res = await fetch("/api/client/upload-avatar", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      toast.dismiss(loadingId);

      if (!data?.success) {
        toast.error(data?.message || "Upload failed");
        setPreviewUrl(null);
        setUploading(false);
        return;
      }

      // ✅ set real url from cloudinary
      setClient?.({
        ...safeClient,
        avatarUrl: data.avatarUrl,
      });

      setPreviewUrl(null);
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Try again.");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      // allow reselect same file
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <aside className="w-[280px] shrink-0 rounded-2xl border border-muted bg-card p-4">
      <div className="flex flex-col items-center rounded-xl border bg-muted/30 p-4">
        {/* Avatar */}
        <div className="relative h-36 w-36">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white/20">
            <Image
              src={avatarSrc}
              alt={safeName}
              fill
              className="object-cover"
              sizes="144px"
              priority
            />

            {/* optional subtle loading overlay */}
            {uploading ? (
              <div className="absolute inset-0 grid place-items-center bg-black/10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              </div>
            ) : null}
          </div>

          {/* hidden input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />

          {/* Edit icon (clean style, top-right) */}
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className={cn(
              "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 border border-slate-200 shadow-sm transition",
              uploading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-white hover:text-slate-900"
            )}
            aria-label="Change profile picture"
            title="Change profile picture"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <h3 className="text-xl font-bold">{firstName}</h3>

          {safeClient.kycStatus === "verified" ? (
            <BadgeCheck size={18} className="text-blue-500" />
          ) : (
            <XCircle size={18} className="text-red-500" />
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="mt-4 space-y-1">
        {item("/client/dashboard/projects", "Projects", FolderKanban)}
        {item("/client/dashboard/profile", "Profile", User)}
        {item("/client/dashboard/billing", "Billing", CreditCard)}
      </div>
    </aside>
  );
}
