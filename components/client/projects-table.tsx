"use client";

import React, { useMemo, useState } from "react";
import type { Project } from "@/types/dashboard";
import StatusPill from "./status-pill";
import ProgressBar from "./progress-bar";
import { cn } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";
import Link from "next/link";

type Tab = "active" | "completed" | "notes";

const isCompleted = (status?: string) => {
  const s = (status || "").toLowerCase().trim();
  return s === "delivered" || s === "completed" || s === "done";
};

const fmtDate = (ms?: number | null) => {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleDateString();
  } catch {
    return "—";
  }
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<Tab>("active");
  const [query, setQuery] = useState("");

  // ✅ accordion open row
  const [openId, setOpenId] = useState<string | null>(null);

  const tabBtn = (key: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-semibold transition",
        tab === key
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  );

  const getDeadline = (p: Project) => {
    if (typeof p.deadlineAt === "number" && p.deadlineAt > 0) return p.deadlineAt;

    const ms = (p.milestones || [])
      .map((m) => Number(m.dueAt || 0))
      .filter((v) => v > 0);

    return ms.length ? Math.max(...ms) : null;
  };

  const getLastUpdated = (p: Project) => {
    const projectUpdated = Number(p.updatedAt || 0);

    const milestoneUpdatedMax = Math.max(
      0,
      ...(p.milestones || []).map((m) => Number(m.updatedAt || 0))
    );

    const v = Math.max(projectUpdated, milestoneUpdatedMax);
    return v > 0 ? v : null;
  };

  const getProgress = (p: Project) => {
    if (typeof p.progress === "number") return clamp(p.progress);

    const list = p.milestones || [];
    if (list.length === 0) return 0;

    const completed = list.filter((m) => isCompleted(m.status)).length;
    return clamp(Math.round((completed / list.length) * 100));
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (projects || []).filter((p) => {
      const done = isCompleted(p.status);

      if (tab === "completed" && !done) return false;
      if (tab === "active" && done) return false;
      if (tab === "notes") return false;

      if (!q) return true;

      const title = (p.title || "").toLowerCase();
      const email = (p.clientEmail || "").toLowerCase();

      return title.includes(q) || email.includes(q);
    });
  }, [projects, tab, query]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Projects</h2>
          <div className="mt-3 flex w-fit items-center gap-2 rounded-xl bg-muted/40 p-1">
            {tabBtn("active", "Active")}
            {tabBtn("completed", "Completed")}
            {tabBtn("notes", "Notes")}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <div className="relative w-full md:w-[320px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or email..."
              className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-background px-3 text-sm font-semibold hover:bg-muted"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-12 bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground">
          <div className="col-span-4">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-2">Deadline</div>
          <div className="col-span-1">Last Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y">
          {rows.map((p) => {
            const deadline = getDeadline(p);
            const lastUpdated = getLastUpdated(p);
            const progress = getProgress(p);
            const isOpen = openId === p.id;

            const milestones = (p.milestones || []).slice().sort((a, b) => {
              const ao = Number(a.order || 0);
              const bo = Number(b.order || 0);
              return ao - bo;
            });

            return (
              <div key={p.id}>
                {/* ===== Main Row ===== */}
                <div className="grid grid-cols-12 items-center px-4 py-4">
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggle(p.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-background hover:bg-muted"
                        aria-label={isOpen ? "Hide milestones" : "Show milestones"}
                        title={isOpen ? "Hide milestones" : "Show milestones"}
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <div className="min-w-0">
                        <div className="truncate font-semibold">{p.title}</div>
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          {p.clientEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <StatusPill status={p.status} />
                  </div>

                  <div className="col-span-2">
                    <ProgressBar value={progress} />
                  </div>

                  <div className="col-span-2 text-sm text-muted-foreground">
                    {fmtDate(deadline)}
                  </div>

                  <div className="col-span-1 text-sm text-muted-foreground">
                    {fmtDate(lastUpdated)}
                  </div>

                  <div className="col-span-1 flex justify-end gap-2">
                    <Link
                      href={`/client/dashboard/projects/${p.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:opacity-95"
                    >
                      View
                    </Link>
                  </div>
                </div>

                {/* ===== Collapsible Milestones ===== */}
                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="rounded-xl border bg-muted/20 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Milestones</p>
                          <p className="text-xs text-muted-foreground">
                            {milestones.length ? "Track progress by milestone." : "No milestones added yet."}
                          </p>
                        </div>

                        <span className="text-xs font-semibold text-muted-foreground">
                          Total: {milestones.length}
                        </span>
                      </div>

                      {milestones.length > 0 ? (
                        <div className="space-y-2">
                          {milestones.map((m) => {
                            const active = p.activeMilestoneId && m.id === p.activeMilestoneId;

                            return (
                              <div
                                key={m.id}
                                className={cn(
                                  "flex items-center justify-between rounded-xl border bg-background px-3 py-2",
                                  active && "border-primary/30 bg-primary/5"
                                )}
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    {active ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                        <Flag size={12} />
                                        Active
                                      </span>
                                    ) : null}

                                    <p className="truncate text-sm font-semibold">
                                      {m.order ? `${m.order}. ` : ""}
                                      {m.title}
                                    </p>
                                  </div>

                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    Due: {fmtDate(m.dueAt)} • Status: {(m.status || "pending").toString()}
                                  </p>
                                </div>

                                <div className="ml-3 w-[120px]">
                                  <ProgressBar value={typeof m.progress === "number" ? clamp(m.progress) : 0} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {rows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              {tab === "notes" ? "Notes section coming soon." : "No projects found."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
