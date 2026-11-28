'use client';

import * as React from 'react';

/** 3px lime bar under the header showing how far the article has been read. Decorative. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return;
    let frame = 0;
    const update = () => {
      const r = target.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[var(--nav-height)] z-40 h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-action-primary" />
    </div>
  );
}
