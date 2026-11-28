'use client';

import * as React from 'react';

const PHRASES = ['growing teams', 'ambitious founders', 'scaling SaaS', 'smart factories', 'growing teams'];
// Calm pace: each phrase rests about two seconds. It runs once, then rests on
// "growing teams" (hovering the heading replays it); reduced motion keeps it still.
const STEP_MS = 2200;

/**
 * Rolling accent phrase for the hero H1 (Figma Hero Headline 41:3200).
 * The real phrase is server-rendered for screen readers and no-JS; the
 * rotating copies are aria-hidden. Runs once and rests on "growing teams",
 * replays on hover of the heading on pointer devices. Below 768px and under
 * reduced motion it is a plain, wrapping phrase.
 */
export function HeroRotator() {
  const [index, setIndex] = React.useState(0);
  // Snapping from the last slot back to the first must not animate backwards.
  const [instant, setInstant] = React.useState(false);
  const timers = React.useRef<number[]>([]);
  const ref = React.useRef<HTMLSpanElement>(null);

  const schedule = React.useCallback(() => {
    for (let i = 1; i < PHRASES.length; i++) {
      timers.current.push(window.setTimeout(() => setIndex(i), STEP_MS * i));
    }
  }, []);

  React.useEffect(() => {
    const t = timers.current;
    const canAnimate = () =>
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(min-width: 768px)').matches;
    if (canAnimate()) schedule();

    const heading = ref.current?.closest('h1');
    const fine = window.matchMedia('(pointer: fine)').matches;
    let running = true;
    t.push(window.setTimeout(() => (running = false), STEP_MS * PHRASES.length));

    const replay = () => {
      if (running || !canAnimate()) return;
      running = true;
      t.forEach(clearTimeout);
      t.length = 0;
      setInstant(true);
      setIndex(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
      schedule();
      t.push(window.setTimeout(() => (running = false), STEP_MS * PHRASES.length));
    };
    if (heading && fine) heading.addEventListener('pointerenter', replay);
    return () => {
      t.forEach(clearTimeout);
      heading?.removeEventListener('pointerenter', replay);
    };
  }, [schedule]);

  return (
    <span ref={ref} className="relative block">
      <span className="sr-only">growing teams</span>
      {/* Phones: a plain phrase that can wrap. */}
      <span aria-hidden className="heading-accent block md:hidden">
        growing teams
      </span>
      {/* Mask: padding keeps the italic descenders and left overhang visible. */}
      <span
        aria-hidden
        className="heading-accent -ml-[0.08em] hidden overflow-hidden px-[0.08em] pb-[0.22em] md:block"
        style={{ height: 'calc(var(--type-display-lh) + 0.22em)' }}
      >
        {/* Each slot is one line plus the descender padding, so the next
            phrase never peeks into the mask. */}
        <span
          className={
            instant
              ? 'block'
              : 'block transition-transform duration-1000 ease-emphasized motion-reduce:transition-none'
          }
          style={{ transform: `translateY(calc(${-index} * (var(--type-display-lh) + 0.22em)))` }}
        >
          {PHRASES.map((p, i) => (
            <span key={i} className="block whitespace-nowrap" style={{ height: 'calc(var(--type-display-lh) + 0.22em)' }}>
              {p}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
