"use client";

import { useMemo } from "react";
import StatCards from "@/components/client/stat-cards";
import ProjectsTable from "@/components/client/projects-table";
import { useProjects } from "@/context/ProjectsContext";


export default function Page() {
  const { projects } = useProjects();

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const s = (p.status || "").toLowerCase().trim();
      return s === "in-progress" || s === "delivered";
    });
  }, [projects]);



  return (
    <>
      <StatCards projects={filteredProjects} />
      <ProjectsTable projects={projects} />
    </>
  );
}
