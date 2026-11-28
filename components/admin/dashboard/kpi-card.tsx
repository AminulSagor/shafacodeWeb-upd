import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

/** Figma: KPI Card (Dashboard 55:3077) */
export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  note,
  tone = 'success',
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  delta: string;
  note: string;
  tone?: 'success' | 'warning' | 'neutral';
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-md border border-line-subtle bg-surface-1 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-body-sm text-fg-muted">{label}</h2>
        <Icon className="size-4.5 text-icon-brand" strokeWidth={1.75} aria-hidden />
      </div>
      <p className="type-h2 text-fg tabular">{value}</p>
      <p className="flex flex-wrap items-center gap-1.5">
        <Badge tone={tone}>{delta}</Badge>
        <span className="type-caption text-fg-subtle">{note}</span>
      </p>
    </div>
  );
}
