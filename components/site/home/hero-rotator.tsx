'use client';

import * as React from 'react';

const PHRASES = ['growing teams', 'ambitious founders', 'scaling SaaS', 'smart factories', 'growing teams'];
const STEP_MS = 1100; // 4 steps: the whole sequence finishes within 5 seconds

/**
 * Rolling accent phrase for the hero H1 (Figma Hero Headline 41:3200).
 * The real phrase is server-rendered for screen readers and no-JS; the
 * rotating copies are aria-hidden. Runs once and rests on "growing teams"
 * (WCAG 2.2.2), replays on hover or focus of the heading on pointer devices.
 * No rotation under reduced motion or below 768px.
 */
export function HeroRotator() {
  const [index, setIndex] = React.useState(0);
  const timers = React.useRef<number[]>([]);
  const ref = React.useRef<HTMLSpanElement>(null);

  const canAnimate = () =>
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(min-width: 768px)').matches;

  /** Schedules phrases 2 to 5; every state change happens inside a timer. */
  const schedule = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.length = 0;
    for (let i = 1; i < PHRASES.length; i++) {
      timers.current.push(window.setTimeout(() => setIndex(i), STEP_MS * i));
    }
  }, []);

  React.useEffect(() => {
    if (canAnimate()) schedule();
    const heading = ref.current?.closest('h1');
    const fine = window.matchMedia('(pointer: fine)').matches;
    let running = false;
    const replay = () => {
      if (running) return;
      if (!canAnimate()) return;
      running = true;
      setIndex(0);
      schedule();
      window.setTimeout(() => (running = false), STEP_MS * PHRASES.length);
    };
    if (heading && fine) {
      heading.addEventListener('pointerenter', replay);
      heading.addEventListener('focusin', replay);
    }
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      heading?.removeEventListener('pointerenter', replay);
      heading?.removeEventListener('focusin', replay);
    };
  }, [schedule]);

  return (
    <span ref={ref} className="relative block">
      <span className="sr-only">growing teams</span>
      {/* Mask: padding keeps the italic descenders and left overhang visible. */}
      <span
        aria-hidden
        className="heading-accent -ml-[0.08em] block overflow-hidden px-[0.08em] pb-[0.22em]"
        style={{ height: 'calc(var(--type-display-lh) + 0.22em)' }}
      >
        {/* Each slot is one line plus the descender padding, so the next
            phrase never peeks into the mask. */}
        <span
          className="block transition-transform duration-[var(--duration-slower)] ease-[var(--ease-emphasized)] motion-reduce:transition-none"
          style={{ transform: `translateY(calc(${-index} * (var(--type-display-lh) + 0.22em)))` }}
        >
          {PHRASES.map((p, i) => (
            <span key={i} className="block h-[calc(var(--type-display-lh)+0.22em)] whitespace-nowrap">
              {p}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
