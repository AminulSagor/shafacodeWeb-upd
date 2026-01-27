"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getEmployees } from "@/actions/employees/getEmployees";


type Employee = {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  position?: string;
  verified?: boolean;
  kycStatus?: string;
  isActive?: boolean;
};

function pill(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-green-50 text-green-700 border-green-200";
  if (s === "pending") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (s === "rejected") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function AdminEmployeesPage() {
  const router = useRouter();

  const [rows, setRows] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      return (
        (r.username || "").toLowerCase().includes(s) ||
        (r.email || r.id || "").toLowerCase().includes(s) ||
        (r.position || "").toLowerCase().includes(s) ||
        (r.kycStatus || "").toLowerCase().includes(s)
      );
    });
  }, [rows, q]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      const filtered = data.filter((r) => r.role === "employee");
      setRows(filtered);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onView = (emailOrId: string) => {
    // encode email for url safety
    router.push(`/admin/employees/${encodeURIComponent(emailOrId)}`);
  };

  return (
    <div className="p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Employees</h1>
          <p className="text-sm text-slate-600">Manage employees.</p>
        </div>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name/email/position/status..."
            className="w-full sm:w-80 rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-black"
          />
          <button
            onClick={load}
            className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="p-3">Employee</th>
                <th className="p-3">Position</th>
                <th className="p-3">KYC</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Employee</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-slate-500" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-500" colSpan={6}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const id = (e.email || e.id) as string;
                  return (
                    <tr key={id} className="border-t">
                      <td className="p-3">
                        <div className="font-medium text-slate-900">{e.username || "—"}</div>
                        <div className="text-xs text-slate-600">{id}</div>
                      </td>

                      <td className="p-3">{e.position || "—"}</td>

                      <td className="p-3">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${pill(e.kycStatus)}`}>
                          {e.kycStatus || "—"}
                        </span>
                      </td>

                      <td className="p-3">
                        {e.verified ? (
                          <span className="text-green-700">Yes</span>
                        ) : (
                          <span className="text-red-700">No</span>
                        )}
                      </td>

                      <td className="p-3">
                        {(e.isActive ?? true) ? (
                          <span className="text-green-700">Active</span>
                        ) : (
                          <span className="text-red-700">Fired</span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => onView(id)}
                            className="rounded-lg border bg-white px-3 py-1.5 text-xs hover:bg-slate-50"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
