"use client";

import React, { createContext, useContext, useState } from "react";
import type { Project } from "@/actions/clients/getClientProjects"; 

type ProjectsCtx = {
  projects: Project[];
  setProjects: (p: Project[]) => void;
};

const Ctx = createContext<ProjectsCtx | null>(null);

export function ProjectsProvider({
  children,
  initialProjects,
}: {
  children: React.ReactNode;
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  return <Ctx.Provider value={{ projects, setProjects }}>{children}</Ctx.Provider>;
}

export function useProjects() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProjects must be used inside ProjectsProvider");
  return ctx;
}
