"use client";

import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
  ShieldAlert,
  User2,
  Mail,
  BadgeInfo,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { useClient } from "@/context/ClientContext";

type ClientProfile = {
  name?: string;
  email?: string;
  role?: string; 
  verified?: boolean;
  kycStatus?: "pending" | "approved" | "rejected" | "not_submitted" | string;
  kycFrontUrl?: string;
  kycBackUrl?: string;
  createdAt?: number;
  updatedAt?: number;
};

function formatDate(ms?: number) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "—";
  }
}

function statusPill(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-green-100 text-green-700 border-green-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
  if (s === "not_submitted")
    return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}




export default function ClientProfilePage() {

  const { client } = useClient() as { client: ClientProfile };

  const initials = useMemo(() => {
    const name = (client?.name || "User").trim();
    const parts = name.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
  }, [client?.name]);

  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className="mx-auto w-full max-w-5xl space-y-6">

        {/* ===== Top Card ===== */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border bg-slate-100 text-lg font-semibold text-slate-700">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-xl font-semibold text-slate-900">
                        {client?.name || "User"}
                  </h1>

                  {client?.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      <BadgeCheck className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                      <ShieldAlert className="h-4 w-4" />
                      Not verified
                    </span>
                  )}
                </div>

                <p className="truncate text-sm text-slate-600">
                  {client?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-sm text-slate-700">
                <User2 className="h-4 w-4 text-slate-500" />
                Role: <b className="font-semibold">{client?.role || "—"}</b>
              </span>

              <span
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium",
                  statusPill(client?.kycStatus),
                ].join(" ")}
              >
                <BadgeInfo className="h-4 w-4" />
                KYC: {client.kycStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Grid ===== */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ===== Details ===== */}
          <div className="rounded-2xl border bg-white p-6 lg:col-span-1">
            <h2 className="text-base font-semibold text-slate-900">
              Account Details
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Client account information.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border bg-slate-50 p-3">
                <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">{client?.email}</p>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-3">
                <p className="text-xs text-slate-500">Created at</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatDate(client?.createdAt)}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-3">
                <p className="text-xs text-slate-500">Updated at</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatDate(client?.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border bg-amber-50 p-3 text-sm text-amber-800">
              <b>Security:</b> Client credentials are server-only protected.
            </div>
          </div>

          {/* ===== KYC Images ===== */}
          <div className="rounded-2xl border bg-white p-6 lg:col-span-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Identity Verification
                </h2>
                <p className="text-sm text-slate-600">
                  Client verification documents.
                </p>
              </div>

              <span
                className={[
                  "mt-2 inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium sm:mt-0",
                  statusPill(client?.kycStatus),
                ].join(" ")}
              >
                <BadgeInfo className="h-4 w-4" />
                Status: {client?.kycStatus || "—"}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Front */}
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Front ID</p>
                  <a
                    href={client?.kycFrontUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-black"
                  >
                    Open <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client?.kycFrontUrl}
                    alt="Front"
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>

              {/* Back */}
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Back ID</p>
                  <a
                    href={client?.kycBackUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-black"
                  >
                    Open <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client?.kycBackUrl}
                    alt="Back"
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* ===== Actions ===== */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                onClick={() => toast("Edit profile coming soon")}
              >
                Edit Profile
              </button>

              <button
                className="rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                onClick={() => toast("Change password coming soon")}
              >
                Change Password
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
