'use client';

import * as React from 'react';
import { Pause, Play } from 'lucide-react';

import { cn } from '@/lib/utils';
import { clientNames } from '@/content/testimonials';

/** One half of the track: the names repeated so a half is always wider than the screen. */
function Half({ hidden }: { hidden?: boolean }) {
  const names = [...clientNames, ...clientNames];
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {names.map((n, i) => (
        <li key={`${n}-${i}`} className="flex items-center">
          <span className={cn('px-6 type-h1 whitespace-nowrap md:px-10', i % 2 ? 'text-outline' : 'text-fg')}>{n}</span>
          <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0 text-icon-brand md:size-8">
            <path fill="currentColor" d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Trusted by" marquee: big names moving right to left on a seamless loop
 * (two identical halves, the track moves exactly one half). Pauses on hover
 * and with the button (WCAG 2.2.2); static under reduced motion.
 * Figma: Client logos 24:2522. TODO(owner): real client logos (spec 14).
 */
export function ClientLogos() {
  const [paused, setPaused] = React.useState(false);
  return (
    <section aria-labelledby="clients-title" className="overflow-hidden border-y border-line-subtle py-10 md:py-14">
      <div className="container-page flex items-center justify-between gap-4">
        <h2 id="clients-title" data-reveal className="type-mono-xs text-fg-subtle">
          Trusted by founders and teams at
        </h2>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Play the client names' : 'Pause the client names'}
          className="grid size-9 cursor-pointer place-items-center rounded-full border border-line-subtle text-icon hover:text-icon-strong focus-visible:focus-ring motion-reduce:hidden"
        >
          {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
        </button>
      </div>
      {/* Screen readers get one plain list. */}
      <ul className="sr-only">
        {clientNames.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <div aria-hidden className="mt-8 mask-fade-x motion-reduce:hidden">
        <div
          className="flex w-max animate-marquee marquee-hover-pause"
          style={{ animationPlayState: paused ? 'paused' : undefined }}
        >
          <Half />
          <Half hidden />
        </div>
      </div>
      <ul aria-hidden className="container-page mt-6 hidden flex-wrap justify-center gap-x-10 gap-y-4 motion-reduce:flex">
        {clientNames.map((n) => (
          <li key={n} className="type-h3 text-fg-muted">
            {n}
          </li>
        ))}
      </ul>
    </section>
  );
}
