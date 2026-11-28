'use client';

import * as React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

import { cn } from '@/lib/utils';

const devices = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: 'w-full', aspect: 'aspect-16/10' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: 'w-3/5', aspect: 'aspect-3/4' },
  { id: 'phone', label: 'Phone', icon: Smartphone, width: 'w-1/3', aspect: 'aspect-9/19' },
] as const;

const bars = [40, 68, 52, 84, 60, 92, 74];

/**
 * "Adaptive user experience" made visible: one dashboard that reflows (via
 * container queries) as the frame moves between desktop, tablet and phone.
 * Cycles on its own until someone picks a device.
 */
export function AdaptivePreview() {
  const [i, setI] = React.useState(0);
  const [auto, setAuto] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = window.setInterval(() => visible && setI((x) => (x + 1) % devices.length), 2800);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [auto]);

  const d = devices[i];
  return (
    <div ref={ref} className="flex flex-col gap-4 xl:min-h-75">
      <div role="group" aria-label="Preview on" className="flex gap-1.5 self-start rounded-full border border-line-subtle p-1">
        {devices.map((dev, n) => (
          <button
            key={dev.id}
            type="button"
            aria-pressed={i === n}
            onClick={() => {
              setAuto(false);
              setI(n);
            }}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 type-label-xs transition-colors focus-visible:focus-ring',
              i === n ? 'bg-action-primary text-fg-on-brand' : 'text-fg-muted hover:text-fg'
            )}
          >
            <dev.icon className="size-3.5" aria-hidden /> {dev.label}
          </button>
        ))}
      </div>
      <div aria-hidden className="grid flex-1 place-items-center rounded-md bg-surface-2 p-4 md:p-6">
        <div
          className={cn(
            '@container overflow-hidden rounded-md border border-line bg-canvas transition-all duration-700 ease-emphasized motion-reduce:transition-none',
            d.width,
            d.aspect,
            'max-h-72'
          )}
        >
          <div className="flex h-full">
            <div className="hidden w-1/5 shrink-0 flex-col gap-1.5 border-r border-line-subtle p-2 @md:flex">
              <span className="mb-1 h-2 w-3/4 rounded-full bg-action-primary" />
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className={cn('h-1.5 rounded-full', k === 0 ? 'bg-fg-muted' : 'bg-surface-3')} />
              ))}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 p-2 @sm:p-3">
              <div className="flex items-center justify-between">
                <span className="h-2 w-1/3 rounded-full bg-fg-muted" />
                <span className="size-3 rounded-full bg-surface-3" />
              </div>
              <div className="grid grid-cols-1 gap-1.5 @xs:grid-cols-2 @md:grid-cols-3">
                {['bg-action-primary', 'bg-surface-3', 'bg-surface-3'].map((c, k) => (
                  <div key={k} className={cn('rounded-xs border border-line-subtle p-1.5', k > 0 && '@max-xs:hidden', k > 1 && '@max-md:hidden')}>
                    <span className={cn('block h-1.5 w-1/2 rounded-full', c)} />
                    <span className="mt-1 block h-1 w-3/4 rounded-full bg-surface-3" />
                  </div>
                ))}
              </div>
              <div className="flex flex-1 items-end gap-1 rounded-xs border border-line-subtle p-1.5">
                {bars.map((h, k) => (
                  <span
                    key={k}
                    className="flex-1 origin-bottom animate-bar rounded-t-xs bg-action-primary motion-reduce:animate-none"
                    style={{ height: `${h}%`, animationDelay: `${k * 120}ms`, opacity: 0.45 + k * 0.08 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
