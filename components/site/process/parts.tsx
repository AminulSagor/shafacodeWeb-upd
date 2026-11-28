import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ProcessStep } from '@/content/process';
import { BOX, CORE } from './geometry';

/** One stage card. Figma: Process Step 18:2838 */
export function StepCard({
  step,
  index,
  active = false,
  className,
}: {
  step: ProcessStep;
  index: number;
  active?: boolean;
  className?: string;
}) {
  const Icon = step.icon;
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-md border bg-surface-1 p-[18px] transition-colors duration-[var(--duration-base)]',
        active ? 'border-line-brand' : 'border-line',
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[var(--chip-radius)] bg-brand-soft text-icon-brand">
          <Icon className="size-4" strokeWidth={2} aria-hidden />
        </span>
        <h3 className="flex-1 type-h5 text-fg">{step.title}</h3>
        <span className="type-mono-sm text-fg-brand tabular" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <p className="mt-2 type-body-sm text-fg-muted">{step.body}</p>
      <p className="mt-1.5 type-mono-xs text-fg-subtle">{step.time}</p>
    </div>
  );
}

/** Glow and concentric rings behind the core (decorative). */
export function Rings() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      <defs>
        <radialGradient id="kc-glow">
          <stop offset="0" stopColor="var(--action-primary)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--action-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CORE.x} cy={CORE.y} r="380" fill="url(#kc-glow)" />
      <circle cx={CORE.x} cy={CORE.y} r="180" fill="none" stroke="var(--line-brand)" strokeOpacity="0.5" />
      <circle cx={CORE.x} cy={CORE.y} r="280" fill="none" stroke="var(--line-subtle)" />
      <circle cx={CORE.x} cy={CORE.y} r="400" fill="none" stroke="var(--line)" strokeDasharray="2 8" />
    </svg>
  );
}

export function CoreDisc({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid size-48 place-items-center rounded-full border-2 border-action-primary bg-[radial-gradient(circle_at_50%_35%,var(--surface-2),var(--canvas))] text-center',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="type-mono-xs text-fg-brand">Core</span>
        <span className="mt-1 type-h4 text-fg">Your product</span>
        <span className="mt-1 type-caption font-normal text-fg-muted">6 stages · 1 team</span>
      </div>
    </div>
  );
}

export function DragHint({ label = 'Drag any stage' }: { label?: string }) {
  return (
    <p
      aria-hidden
      className="absolute bottom-[18px] left-1/2 flex h-[34px] -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-canvas px-4 type-mono-xs text-fg-muted"
    >
      <ArrowLeft className="size-3.5 text-icon-brand" />
      {label}
      <ArrowRight className="size-3.5 text-icon-brand" />
    </p>
  );
}
