"use client";

import React, { useMemo } from "react";
import type { Project } from "@/types/dashboard";
import { CalendarDays, CheckCircle2, Layers3 } from "lucide-react";

type DashboardStats = {
  activeProjects: number;
  completedProjects: number;
  nextMilestone: string; 
};

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

const getNextMilestoneLabel = (projects: Project[]) => {
  const now = Date.now();
  let best: { dueAt: number; title: string; projectTitle: string } | null = null;

  for (const p of projects || []) {
    for (const m of p.milestones || []) {
      const dueAt = typeof m.dueAt === "number" ? m.dueAt : 0;
      if (!dueAt || dueAt <= now) continue;

      if (!best || dueAt < best.dueAt) {
        best = {
          dueAt,
          title: m.title || "Milestone",
          projectTitle: p.title || "Project",
        };
      }
    }
  }

  if (!best) return "—";

  const date = fmtDate(best.dueAt);
  return `${date} — ${best.title} (${best.projectTitle})`;
};

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border bg-muted/40 p-2">{icon}</div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>

          <p className="mt-1 text-2xl font-extrabold leading-tight truncate">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StatCards({ projects }: { projects: Project[] }) {
  const stats: DashboardStats = useMemo(() => {
    let completed = 0;
    let active = 0;

    for (const p of projects || []) {
      if (isCompleted(p.status)) completed++;
      else active++;
    }

    return {
      activeProjects: active,
      completedProjects: completed,
      nextMilestone: getNextMilestoneLabel(projects),
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Layers3 size={18} />}
        title="Active Projects"
        value={stats.activeProjects}
        subtitle="Ongoing Now"
      />

      <StatCard
        icon={<CheckCircle2 size={18} />}
        title="Completed Projects"
        value={stats.completedProjects}
        subtitle="Successfully Done"
      />

      <StatCard
        icon={<CalendarDays size={18} />}
        title="Next Milestone"
        value={stats.nextMilestone === "—" ? "—" : "Upcoming"}
        subtitle={stats.nextMilestone === "—" ? "No upcoming milestone" : stats.nextMilestone}
      />
    </div>
  );
}
