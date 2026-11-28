'use client';

import * as React from 'react';

/** A number that eases to its new value (formatted by `format`). Instant under reduced motion. */
export function AnimatedNumber({ value, format = String, duration = 500 }: { value: number; format?: (n: number) => string; duration?: number }) {
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);
  React.useEffect(() => {
    const d = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration;
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = d ? Math.min(1, (t - start) / d) : 1;
      const v = a + (value - a) * (1 - Math.pow(1 - p, 3));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(shown)}</>;
}
