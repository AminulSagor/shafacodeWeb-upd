'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CornerDownLeft, Plus, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { adminNav, createLinks } from './nav';

type Entry = { href: string; label: string; hint: string; create?: boolean };

const allEntries: Entry[] = [
  ...adminNav.flatMap((g) => g.items.map((i) => ({ href: i.href, label: i.label, hint: g.label }))),
  ...createLinks.map((c) => ({ href: c.href, label: `New ${c.label.toLowerCase()}`, hint: 'Create', create: true })),
];

/** Jump to any admin screen or create action. Opens with ⌘K / Ctrl+K. */
export function CommandMenu({ owner }: { owner: boolean }) {
  const entries = owner ? allEntries : allEntries.filter((e) => e.href !== '/admin/settings');
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const listId = React.useId();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q ? entries.filter((e) => `${e.label} ${e.hint}`.toLowerCase().includes(q)) : entries;
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    setOpen(false);
    router.push(entry.href);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery('');
      setActive(0);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-control w-full max-w-70 items-center gap-2.5 rounded-field bg-field px-3 text-left type-body-sm text-fg-subtle shadow-field hover:text-fg-muted focus-visible:focus-ring"
      >
        <Search className="size-4 shrink-0 text-icon" aria-hidden />
        <span className="flex-1 truncate">Search anything…</span>
        <kbd className="rounded-xs border border-line-subtle bg-surface-2 px-1.5 type-mono-xs text-fg-subtle">⌘K</kbd>
      </button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="top-[15vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-140">
          <DialogTitle className="sr-only">Search the admin</DialogTitle>
          <DialogDescription className="sr-only">Type to filter screens and actions, use the arrow keys and press Enter.</DialogDescription>
          <div className="flex items-center gap-2.5 border-b border-line-subtle px-4">
            <Search className="size-4 shrink-0 text-icon" aria-hidden />
            <input
              autoFocus
              role="combobox"
              aria-expanded={results.length > 0}
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={results[current] ? `${listId}-${current}` : undefined}
              aria-label="Search screens and actions"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActive((current + 1) % Math.max(results.length, 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActive((current - 1 + results.length) % Math.max(results.length, 1));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  go(results[current]);
                }
              }}
              placeholder="Search screens and actions…"
              className="h-14 flex-1 bg-transparent type-body text-fg outline-none placeholder:text-fg-subtle"
            />
          </div>
          <ul id={listId} role="listbox" aria-label="Results" className="max-h-90 overflow-y-auto p-2">
            {results.map((r, i) => (
              <li
                key={r.href}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === current}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-button-sm px-3 py-2.5 type-body-sm text-fg',
                  i === current && 'bg-hover'
                )}
              >
                {r.create && <Plus className="size-4 text-icon" aria-hidden />}
                <span className="flex-1">{r.label}</span>
                <span className="type-caption font-normal text-fg-subtle">{r.hint}</span>
                {i === current && <CornerDownLeft className="size-3.5 text-icon-muted" aria-hidden />}
              </li>
            ))}
          </ul>
          <p role="status" className={results.length ? 'sr-only' : 'px-3 pb-6 text-center type-body-sm text-fg-subtle'}>
            {results.length ? `${results.length} results` : `No matches for “${query}”.`}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
