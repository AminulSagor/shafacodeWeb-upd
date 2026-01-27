"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ShieldAlert,
  User2,
  Mail,
  Briefcase,
  BadgeInfo,
  ExternalLink,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getEmployee } from "@/actions/employees/getEmployee";
import { updateEmployee } from "@/actions/employees/updateEmployee";

type Employee = {
  id: string; // doc id (email)
  username?: string;
  email?: string;
  role?: string;
  position?: string;
  phone?: string;
  verified?: boolean;

  kycStatus?: "pending" | "approved" | "rejected" | "not_submitted" | string;
  kycFrontUrl?: string;
  kycBackUrl?: string;

  createdAt?: number;
  kycUpdatedAt?: number;

  isActive?: boolean;
  firedAt?: number;
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

export default function EmployeeViewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const email = decodeURIComponent(params.id);

  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [edit, setEdit] = useState({ username: "", position: "", phone: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getEmployee(email);
      if (!data) {
        toast.error("Employee not found");
        setUser(null);
      } else {
        setUser(data as Employee);
        setEdit({
          username: data.username || "",
          position: data.position || "",
          phone: data.phone || "",
        });
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load employee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [email]);

  const initials = useMemo(() => {
    const name = (user?.username || "User").trim();
    const parts = name.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
  }, [user?.username]);

  const approveKyc = async () => {
    setBusy(true);
    const tid = toast.loading("Approving KYC...");
    try {
      await updateEmployee(email, {
        kycStatus: "approved",
        kycUpdatedAt: Date.now(),
      });
      await load();
      toast.dismiss(tid);
      toast.success("KYC approved");
    } catch (e: any) {
      toast.dismiss(tid);
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const rejectKyc = async () => {
    const reason = prompt("Reject reason:") || "";
    setBusy(true);
    const tid = toast.loading("Rejecting KYC...");
    try {
      await updateEmployee(email, {
        kycStatus: "rejected",
        kycUpdatedAt: Date.now(),
      });
      await load();
      toast.dismiss(tid);
      toast.success(reason ? `Rejected: ${reason}` : "KYC rejected");
    } catch (e: any) {
      toast.dismiss(tid);
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const fireUser = async () => {
    if (!confirm(`Fire (disable) ${email}?`)) return;
    setBusy(true);
    const tid = toast.loading("Firing user...");
    try {
      await updateEmployee(email, { isActive: false, firedAt: Date.now() });
      await load();
      toast.dismiss(tid);
      toast.success("User fired");
    } catch (e: any) {
      toast.dismiss(tid);
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    const tid = toast.loading("Updating...");
    try {
      await updateEmployee(email, {
        username: edit.username.trim(),
        position: edit.position.trim(),
        phone: edit.phone.trim(),
      });
      await load();
      toast.dismiss(tid);
      toast.success("Updated");
    } catch (e: any) {
      toast.dismiss(tid);
      toast.error(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-600">
        Loading employee...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-600">
        Employee not found
      </div>
    );
  }

  const titleCase = (str = "") => str.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Top card (same as profile) */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border bg-slate-100 text-lg font-semibold text-slate-700">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-xl font-semibold text-slate-900">
                    {user.username || "—"}
                  </h1>

                  {user.verified ? (
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

                  {(user.isActive ?? true) ? null : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                      Fired
                    </span>
                  )}
                </div>

                <p className="truncate text-sm text-slate-600">
                  {user.email || user.id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-sm text-slate-700">
                <User2 className="h-4 w-4 text-slate-500" />
                Role: <b className="font-semibold">{user.role || "—"}</b>
              </span>

              {/* <span className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-sm text-slate-700">
                <Briefcase className="h-4 w-4 text-slate-500" />
                Position:{" "}
                <b className="font-semibold">{user.position || "—"} developer</b>
              </span> */}

              <span
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium",
                  statusPill(user.kycStatus),
                ].join(" ")}
              >
                <BadgeInfo className="h-4 w-4" />
                KYC: {user.kycStatus || "—"}
              </span>

              <button
                onClick={() => router.back()}
                className="rounded-xl border bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Grid (same as profile) */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Details */}
          <div className="rounded-2xl border bg-white p-6 lg:col-span-1">
            <h2 className="text-base font-semibold text-slate-900">
              Account Details
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Basic profile info & timestamps.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border bg-slate-50 p-3">
                <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {user.email || user.id}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-slate-50 p-3">
                <User2 className="mt-0.5 h-4 w-4 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Username</p>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {user.username || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-slate-50 p-3">
                <Briefcase className="mt-0.5 h-4 w-4 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Position</p>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {titleCase(user.position || "—")}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-3">
                <p className="text-xs text-slate-500">Created at</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-3">
                <p className="text-xs text-slate-500">KYC updated at</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatDate(user.kycUpdatedAt)}
                </p>
              </div>

              {(user.isActive ?? true) ? null : (
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs text-slate-500">Fired at</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(user.firedAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-xl border bg-amber-50 p-3 text-sm text-amber-800">
              <b>Admin:</b> Approve/Reject KYC & update employee info.
            </div>
          </div>

          {/* KYC + Admin Actions (same card style) */}
          <div className="rounded-2xl border bg-white p-6 lg:col-span-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  KYC Documents
                </h2>
                <p className="text-sm text-slate-600">
                  Front & back ID images uploaded by the user.
                </p>
              </div>

              <span
                className={[
                  "mt-2 inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium sm:mt-0",
                  statusPill(user.kycStatus),
                ].join(" ")}
              >
                <BadgeInfo className="h-4 w-4" />
                Status: {user.kycStatus || "—"}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Front */}
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Front Side
                  </p>
                  {user.kycFrontUrl ? (
                    <a
                      href={user.kycFrontUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-black"
                    >
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border bg-white">
                  {user.kycFrontUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.kycFrontUrl}
                      alt="KYC Front"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-56 w-full place-items-center text-sm text-slate-500">
                      No image uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Back */}
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Back Side
                  </p>
                  {user.kycBackUrl ? (
                    <a
                      href={user.kycBackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-black"
                    >
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border bg-white">
                  {user.kycBackUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.kycBackUrl}
                      alt="KYC Back"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-56 w-full place-items-center text-sm text-slate-500">
                      No image uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin actions row (same button style as profile) */}
            <div className="mt-5 flex flex-wrap gap-2">
              {user.kycStatus === "approved" ? null : (
                <button
                  disabled={busy}
                  type="button"
                  className="rounded-xl border bg-green-100 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200 disabled:opacity-60 cursor-pointer"
                  onClick={approveKyc}
                >
                  Approve KYC
                </button>
              )}

              <button
                disabled={busy}
                type="button"
                className="rounded-xl border bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 disabled:opacity-60 cursor-pointer"
                onClick={rejectKyc}
              >
                Reject KYC
              </button>

              <button
                disabled={busy}
                type="button"
                className="rounded-xl border bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60 cursor-pointer"
                onClick={fireUser}
              >
                Fire User
              </button>
            </div>

            {/* Inline edit area (same card visual language) */}
            <div className="mt-6 rounded-2xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Edit Employee
                  </h3>
                  <p className="text-xs text-slate-600">
                    Update basic info and save.
                  </p>
                </div>

                <button
                  disabled={busy}
                  type="button"
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60"
                  onClick={save}
                >
                  Save Changes
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs text-slate-600">Username</label>
                  <input
                    value={edit.username}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, username: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Position</label>
                  <input
                    value={edit.position}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, position: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Phone</label>
                  <input
                    value={edit.phone}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
