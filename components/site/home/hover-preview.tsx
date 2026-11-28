'use client';

import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * Floating image that follows the pointer over a list (awwwards-style).
 * Rows mark themselves with `data-preview={index}`. The card trails the
 * pointer, tilts with its speed and cross-fades between images. Mouse and
 * trackpad only; nothing under reduced motion. Decorative (aria-hidden).
 */
export function HoverPreview({ images, children, className }: { images: { src: string; alt: string }[]; children: React.ReactNode; className?: string }) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const card = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);
  const [active, setActive] = React.useState<number | null>(null);
  const target = React.useRef({ x: 0, y: 0 });
  const pos = React.useRef({ x: 0, y: 0, rot: 0 });

  React.useEffect(() => {
    const ok = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    const id = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = () => {
      const p = pos.current;
      const t = target.current;
      const dx = t.x - p.x;
      p.x += dx * 0.14;
      p.y += (t.y - p.y) * 0.14;
      p.rot += (Math.max(-10, Math.min(10, dx * 0.08)) - p.rot) * 0.12;
      if (card.current) card.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${p.rot.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  return (
    <div
      ref={wrap}
      className={cn('relative', className)}
      onPointerMove={(e) => {
        if (!enabled || !wrap.current) return;
        const r = wrap.current.getBoundingClientRect();
        target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        const row = (e.target as Element).closest<HTMLElement>('[data-preview]');
        const next = row ? Number(row.dataset.preview) : null;
        if (next !== active) {
          if (active === null) pos.current = { ...target.current, rot: 0 };
          setActive(next);
        }
      }}
      onPointerLeave={() => setActive(null)}
    >
      {children}
      {enabled && (
        <div
          ref={card}
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-0 left-0 z-10 aspect-4/3 w-80 overflow-hidden rounded-md transition-[opacity,scale] duration-500 ease-out',
            active === null ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
          )}
        >
          {images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              fill
              sizes="320px"
              className={cn('object-cover transition-[opacity,scale] duration-500 ease-out', i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
