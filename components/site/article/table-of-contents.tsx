'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type TocItem = { id: string; text: string };

/** "On this page" with the section in view highlighted. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -60% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  return (
    <nav aria-labelledby="toc-title" className="rounded-md border border-line-subtle p-4">
      <p id="toc-title" className="type-mono-xs text-fg-subtle">
        On this page
      </p>
      <ol className="mt-3 flex flex-col gap-1">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? 'location' : undefined}
              className={cn(
                'block border-l-2 py-1 pl-3 type-body-sm transition-colors focus-visible:focus-ring',
                active === i.id ? 'border-action-primary text-fg' : 'border-line-subtle text-fg-subtle hover:text-fg'
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
