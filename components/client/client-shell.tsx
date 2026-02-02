"use client";
import React from "react";
import Sidebar from "@/components/client/sidebar";
import Topbar from "@/components/client/topbar";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Topbar />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
