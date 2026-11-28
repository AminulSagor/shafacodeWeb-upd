'use client';

import * as React from 'react';

/**
 * Sets `data-inview` on its element ("false" until it scrolls into view, then
 * "true"), so CSS can run an entrance animation (progress fills, gauge arcs)
 * with `group-data-[inview=false]:` start states. Without JavaScript, or under
 * reduced motion, the attribute is never set and the end state shows.
 */
export function InView({
  as: Tag = 'div',
  className,
  children,
  rootMargin = '0px 0px -15% 0px',
}: {
  as?: 'div' | 'section' | 'ul' | 'ol';
  className?: string;
  children: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return; // already visible
    el.dataset.inview = 'false';
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = 'true';
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (el.dataset.inview !== 'true') delete el.dataset.inview;
    };
  }, [rootMargin]);

  return React.createElement(Tag, { ref, className }, children);
}
