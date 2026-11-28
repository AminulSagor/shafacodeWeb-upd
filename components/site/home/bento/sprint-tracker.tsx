'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const sprints = [
  { label: 'UI design & prototype', short: 'UI design', status: 'Done', pct: 25 },
  { label: 'Sprint 2 · Auth & dashboard', short: 'Auth & dashboard', status: 'Done', pct: 48 },
  { label: 'Sprint 3 · Payments & orders', short: 'Payments & orders', status: 'In progress', pct: 62 },
  { label: 'Sprint 4 · Reports', short: 'Reports', status: 'Next', pct: 100 },
] as const;
const CURRENT = 2;
const feed = ['Demo shared with the client', 'Payments API merged', 'Weekly notes sent', 'QA pass on checkout'];

/**
 * Live sprint card for "Transparent execution": hover or focus a sprint to see
 * where the project stood (the number and bar animate), the current sprint
 * pulses, and a short activity line rotates.
 */
export function SprintTracker() {
  const [active, setActive] = React.useState<number>(CURRENT);
  const [pct, setPct] = React.useState<number>(sprints[CURRENT].pct);
  const [line, setLine] = React.useState(0);
  const pctRef = React.useRef(pct);

  // Tween the number towards the active sprint.
  React.useEffect(() => {
    const target = sprints[active].pct;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600;
    const from = pctRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = duration ? Math.min(1, (t - start) / duration) : 1;
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      pctRef.current = v;
      setPct(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setLine((l) => (l + 1) % feed.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  const s = sprints[active];
  return (
    <div className="flex flex-col xl:min-h-75" onPointerLeave={() => setActive(CURRENT)}>
      <div className="flex items-end justify-between gap-4">
        <p className="type-stat text-fg tabular" aria-live="polite">
          {pct}%<span className="sr-only"> complete at {s.short}</span>
        </p>
        <div className="text-right">
          <p className="type-mono-xs text-fg-brand">
            {active === 3 ? 'Planned' : `Sprint ${active + 1} of 4`}
          </p>
          <p className="mt-1 type-body-sm text-fg">{s.short}</p>
        </div>
      </div>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
        <div className="h-full rounded-full bg-action-primary transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
        <div className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-linear-to-r from-transparent via-white/25 to-transparent motion-reduce:hidden" />
      </div>
      <ul className="mt-4 flex flex-col">
        {sprints.map((row, i) => (
          <li key={row.label}>
            <button
              type="button"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(CURRENT)}
              aria-pressed={active === i}
              className={cn(
                'flex w-full cursor-default items-center justify-between gap-4 border-b border-line-subtle py-2.5 text-left transition-[padding,background-color] duration-300 focus-visible:focus-ring',
                active === i && 'bg-hover pl-2'
              )}
            >
              <span className="type-body-sm text-fg">{row.label}</span>
              <span
                className={cn(
                  'flex shrink-0 items-center gap-2 type-mono-xs',
                  row.status === 'Done' && 'text-fg-success',
                  row.status === 'In progress' && 'text-fg-brand',
                  row.status === 'Next' && 'text-fg-subtle'
                )}
              >
                {row.status === 'In progress' && (
                  <span aria-hidden className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-action-primary opacity-70 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-action-primary" />
                  </span>
                )}
                {row.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 type-caption font-normal text-fg-subtle">
        <span aria-hidden className="size-1.5 rounded-full bg-fg-success" />
        <span key={line} className="animate-fade-up motion-reduce:animate-none">
          {feed[line]}
        </span>
      </p>
    </div>
  );
}
