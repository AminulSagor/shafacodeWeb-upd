'use client';

import * as React from 'react';

/**
 * One listener set for the whole site, driven by data attributes:
 * - `data-reveal` (fade and rise, `clip` for headings, `scale` for media),
 *   with `--reveal-i` for stagger; runs when the element scrolls into view.
 * - `data-spotlight`: a glow that follows the pointer over a card.
 * - `data-magnetic` (or a direct child link/button of `data-magnetic-group`):
 *   buttons lean a few pixels toward the pointer.
 * Nothing runs under reduced motion; on touch devices only the reveals run.
 */
export function MotionLayer() {
  React.useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const html = document.documentElement;

    // A clipped element has no visible area, so its parent is observed instead.
    const proxies = new Map<Element, HTMLElement[]>();
    const watch = (el: HTMLElement) => {
      const box = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
      if (box !== el) proxies.set(box, [...(proxies.get(box) ?? []), el]);
      io.observe(box);
    };
    const io = new IntersectionObserver(
      (entries) => {
        // Items that enter together ripple in order (top to bottom, left to right).
        const batch = entries
          .filter((e) => e.isIntersecting)
          .flatMap((e) => {
            io.unobserve(e.target);
            const via = proxies.get(e.target);
            proxies.delete(e.target);
            return via ?? [e.target as HTMLElement];
          })
          .filter((el) => !el.hasAttribute('data-revealed'))
          .sort((x, y) => {
            const a = x.getBoundingClientRect();
            const b = y.getBoundingClientRect();
            return Math.abs(a.top - b.top) > 24 ? a.top - b.top : a.left - b.left;
          });
        batch.forEach((el, n) => {
          if (!el.style.getPropertyValue('--reveal-i')) el.style.setProperty('--reveal-i', String(Math.min(n, 6)));
          el.setAttribute('data-revealed', '');
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    const scan = (root: ParentNode, firstPass: boolean) => {
      root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach((el) => {
        // On the first pass, whatever is already on screen stays visible (no flash).
        if (firstPass && el.getBoundingClientRect().top < window.innerHeight) el.setAttribute('data-revealed', '');
        else watch(el);
      });
    };
    scan(document, true);
    html.classList.add('js-motion');

    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches('[data-reveal]:not([data-revealed])')) watch(n);
          scan(n, false);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const fine = window.matchMedia('(pointer: fine)').matches;
    let magnet: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      const target = e.target as Element | null;
      const spot = target?.closest<HTMLElement>('[data-spotlight]');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      const direct = target?.closest<HTMLElement>('[data-magnetic]');
      const inGroup = target?.closest<HTMLElement>('a, button');
      const m = direct ?? (inGroup?.parentElement?.hasAttribute('data-magnetic-group') ? inGroup : null);
      if (magnet && magnet !== m) magnet.style.transform = '';
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 8;
        const dy = ((e.clientY - (r.top + r.height / 2)) / r.height) * 6;
        m.style.transition = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
        m.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const onLeave = () => {
      if (magnet) magnet.style.transform = '';
      magnet = null;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      html.classList.remove('js-motion');
    };
  }, []);
  return null;
}
