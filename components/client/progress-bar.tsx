"use client";

import React from "react";

export default function ProgressBar({ value }: { value: number }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
      </div>
      <span className="text-sm text-muted-foreground">{v}%</span>
    </div>
  );
}
