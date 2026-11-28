'use client';

import * as React from 'react';

type KineticCoreComponent = (typeof import('./kinetic-core'))['KineticCore'];

/**
 * Keeps the server-rendered static diagram until it nears the viewport, then
 * imports and swaps in the interactive Kinetic Core (motion lives only in that
 * chunk). Stays static on touch-only devices and under reduced motion.
 */
export function KineticCoreLoader({ fallback }: { fallback: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [Core, setCore] = React.useState<KineticCoreComponent | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok =
      window.matchMedia('(min-width: 1440px)').matches &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        import('./kinetic-core')
          .then((m) => {
            if (!cancelled) setCore(() => m.KineticCore);
          })
          .catch(() => {}); // keep the static diagram if the chunk fails
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return <div ref={ref}>{Core ? <Core /> : fallback}</div>;
}
