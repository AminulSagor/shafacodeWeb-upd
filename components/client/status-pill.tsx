"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type ProjectStatus = "in-progress" | "delivered";

const map: Record<ProjectStatus, { label: string; className: string }> = {
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

export default function StatusPill({
  status,
}: {
  status: ProjectStatus | string;
}) {
  const key = (status || "").toLowerCase().trim() as ProjectStatus;

  const s =
    map[key] ??
    ({
      label: status || "Unknown",
      className: "bg-slate-50 text-slate-700 border-slate-200",
    } as const);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        s.className
      )}
    >
      {s.label}
    </span>
  );
}
