"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UserCheck,
  UserX,
} from "lucide-react";

type KycStatus = "not_submitted" | "pending" | "approved" | "rejected";
type ClientStatus = "active" | "blocked";

type Client = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  kycStatus: KycStatus;
  status: ClientStatus;
  createdAt: number;
};

const demoClients: Client[] = [
  {
    id: "cl_1023",
    name: "Mahabur Rahman",
    email: "mahabursoikot04@gmail.com",
    verified: true,
    kycStatus: "pending",
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: "cl_1024",
    name: "Ayesha Islam",
    email: "ayesha@client.com",
    verified: true,
    kycStatus: "approved",
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
  },
  {
    id: "cl_1025",
    name: "Nahid Hasan",
    email: "nahid@client.com",
    verified: false,
    kycStatus: "not_submitted",
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "cl_1026",
    name: "Rafiul Karim",
    email: "rafiul@client.com",
    verified: true,
    kycStatus: "rejected",
    status: "blocked",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
  },
];

/* ---------------- helpers ---------------- */

const fmtDate = (ms: number) => {
  try {
    return new Date(ms).toLocaleDateString();
  } catch {
    return "—";
  }
};

function kycMeta(s: KycStatus) {
  if (s === "approved") return { label: "KYC Approved", Icon: ShieldCheck };
  if (s === "pending") return { label: "KYC Pending", Icon: ShieldAlert };
  if (s === "rejected") return { label: "KYC Rejected", Icon: ShieldX };
  return { label: "KYC Not Submitted", Icon: ShieldAlert };
}

// ✅ token-based pill colors
function pillClass(kind: "ok" | "warn" | "bad" | "neutral") {
  if (kind === "ok") return "bg-green/10 border-green/25 text-green";
  if (kind === "warn") return "bg-secondary/60 border-gray/15 text-gray";
  if (kind === "bad") return "bg-primary/10 border-primary/25 text-primary";
  return "bg-white border-gray/15 text-gray/60";
}

function kycPillClass(s: KycStatus) {
  if (s === "approved") return pillClass("ok");
  if (s === "pending") return pillClass("warn");
  if (s === "rejected") return pillClass("bad");
  return pillClass("neutral");
}

function statusPillClass(s: ClientStatus) {
  return s === "active" ? pillClass("ok") : pillClass("bad");
}

function Pill({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold",
        className
      )}
    >
      {children}
    </span>
  );
}

export default function AdminClientsPage() {
  const [q, setQ] = React.useState("");
  const [onlyPending, setOnlyPending] = React.useState(false);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return demoClients.filter((c) => {
      const match =
        !s ||
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.id.toLowerCase().includes(s);

      const matchPending = !onlyPending ? true : c.kycStatus === "pending";

      return match && matchPending;
    });
  }, [q, onlyPending]);

  const total = demoClients.length;
  const pending = demoClients.filter((c) => c.kycStatus === "pending").length;
  const active = demoClients.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-5 rounded-2xl bg-secondary/30 p-4 sm:p-6">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray">Clients</h1>
          <p className="mt-1 text-sm font-semibold text-gray/50">
            Simple client list with KYC + status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Pill className="bg-white border-gray/15 text-gray">
            <Users size={14} className="text-gray/60" />
            Total: {total}
          </Pill>
          <Pill className="bg-white border-gray/15 text-gray">
            Pending: {pending}
          </Pill>
          <Pill className="bg-white border-gray/15 text-gray">
            Active: {active}
          </Pill>
        </div>
      </div>

      {/* search + quick filter */}
      <Card className="rounded-2xl border border-gray/15 bg-white p-4 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[360px]">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray/50"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, id..."
              className={cn(
                "w-full rounded-2xl border border-gray/15 bg-white py-3 pl-10 pr-4",
                "text-sm font-semibold text-gray outline-none transition",
                "focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={onlyPending ? "default" : "secondary"}
              size="md"
              onClick={() => setOnlyPending((v) => !v)}
              className={cn(
                onlyPending
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-secondary text-gray hover:bg-secondary/80"
              )}
            >
              {onlyPending ? "Showing Pending" : "Only Pending KYC"}
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="bg-secondary text-gray hover:bg-secondary/80"
              onClick={() => {
                setQ("");
                setOnlyPending(false);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* list */}
      <Card className="rounded-2xl border border-gray/15 bg-white p-0 shadow-none">
        <div className="border-b border-gray/15 px-5 py-4">
          <p className="text-sm font-extrabold text-gray">
            Client List{" "}
            <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-xs font-extrabold text-gray/60">
              {filtered.length}
            </span>
          </p>
        </div>

        <div className="divide-y divide-gray/15">
          {filtered.map((c) => {
            const { label, Icon } = kycMeta(c.kycStatus);
            return (
              <div
                key={c.id}
                className={cn(
                  "flex flex-col gap-3 px-5 py-4 transition",
                  "hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between"
                )}
              >
                {/* left */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-sm font-extrabold text-gray">
                    {c.name
                      .split(" ")
                      .slice(0, 2)
                      .map((x) => x[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-gray">{c.name}</p>
                    <p className="mt-1 text-xs font-semibold text-gray/50">
                      {c.email}
                      <span className="mx-2 text-gray/20">•</span>#{c.id}
                      <span className="mx-2 text-gray/20">•</span>
                      Joined {fmtDate(c.createdAt)}
                    </p>
                  </div>
                </div>

                {/* right */}
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className={kycPillClass(c.kycStatus)}>
                    <Icon size={14} />
                    {label}
                  </Pill>

                  <Pill className={statusPillClass(c.status)}>
                    {c.status === "active" ? (
                      <UserCheck size={14} />
                    ) : (
                      <UserX size={14} />
                    )}
                    {c.status === "active" ? "Active" : "Blocked"}
                  </Pill>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-secondary text-gray hover:bg-secondary/80"
                    onClick={() => {
                      // TODO: router.push(`/admin/clients/${c.id}`)
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-lg font-extrabold text-gray">No clients found</p>
              <p className="mt-1 text-sm font-semibold text-gray/50">
                Try another search or reset.
              </p>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
