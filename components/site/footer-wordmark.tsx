'use client';

import * as React from 'react';

const LETTERS = 'shafacode'.split('');
const MAX_LIFT = 12;

/**
 * Outlined footer wordmark. Letters lift toward the cursor (max 12px).
 * Decorative: aria-hidden, static under reduced motion and on touch.
 * Figma: Footer Wordmark 42:3852
 */
export function FooterWordmark() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-letter]'));
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const span of spans) {
          const r = span.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy);
          const lift = Math.max(0, 1 - dist / 360) * MAX_LIFT;
          span.style.transform = `translateY(${-lift}px)`;
        }
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      for (const span of spans) span.style.transform = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="overflow-hidden pt-4 select-none">
      <p className="type-wordmark flex justify-center text-transparent text-outline">
        {LETTERS.map((l, i) => (
          <span
            key={i}
            data-letter
            className="inline-block transition-transform duration-(--duration-slow) ease-out"
          >
            {l}
          </span>
        ))}
      </p>
    </div>
  );
}
