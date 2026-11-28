'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, EyeOff, GripVertical, Pencil, PenLine } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { deleteTeamMember, reorderTeam } from '@/actions/admin/team';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/admin/format';

type Member = { id: string; name: string; role: string; photoUrl: string | null; visible: boolean; isAuthor: boolean };

/**
 * Display order with drag and drop, plus Move up / Move down buttons as the
 * keyboard and single-pointer alternative (WCAG 2.5.7). Saves after each move.
 */
export function TeamOrder({ members }: { members: Member[] }) {
  const [items, setItems] = React.useState(members);
  const [drag, setDrag] = React.useState<number | null>(null);
  const [announce, setAnnounce] = React.useState('');
  const [saving, startTransition] = React.useTransition();
  const listRef = React.useRef<HTMLOListElement>(null);

  const commit = (next: Member[], moved: Member) => {
    const before = items;
    setItems(next);
    setAnnounce(`${moved.name} moved to position ${next.indexOf(moved) + 1} of ${next.length}`);
    startTransition(async () => {
      const res = await reorderTeam(next.map((m) => m.id));
      if (!res.ok) {
        setItems(before);
        toast.error(res.error);
      }
    });
  };
  const move = (from: number, to: number, focus?: 'up' | 'down') => {
    // One save at a time, so an older response can never overwrite a newer order.
    if (saving || to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m!);
    commit(next, m!);
    if (focus) {
      // Keep focus on the moved row; at an end, the other arrow (this one is now disabled).
      const atEnd = to === 0 || to === next.length - 1;
      const dir = atEnd ? (to === 0 ? 'down' : 'up') : focus;
      requestAnimationFrame(() => listRef.current?.querySelector<HTMLButtonElement>(`[data-move="${m!.id}-${dir}"]`)?.focus());
    }
  };

  if (!items.length) return <p className="px-5 py-14 text-center type-body-sm text-fg-subtle">No team members yet.</p>;
  return (
    <>
      <ol ref={listRef} aria-busy={saving || undefined} className="divide-y divide-line-subtle">
        {items.map((m, i) => (
          <li
            key={m.id}
            draggable
            onDragStart={(e) => {
              setDrag(i);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', m.id); // Firefox starts a drag only with data
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (drag !== null) move(drag, i);
              setDrag(null);
            }}
            onDragEnd={() => setDrag(null)}
            className={cn('flex items-center gap-3 px-4 py-3 hover:bg-hover', drag === i && 'opacity-50')}
          >
            <GripVertical className="size-4 shrink-0 cursor-grab text-icon-muted" aria-hidden />
            <span className="w-6 shrink-0 text-right type-mono-xs text-fg-subtle">{i + 1}</span>
            {m.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
              <img src={m.photoUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-3 type-label-sm text-fg-muted">
                {initials(m.name)}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col">
              <Link href={`/admin/team/${m.id}`} className="truncate rounded-sm type-label text-fg hover:underline focus-visible:focus-ring">
                {m.name}
              </Link>
              <span className="truncate type-caption font-normal text-fg-subtle">{m.role}</span>
            </span>
            <span className="flex items-center gap-1.5 max-sm:hidden">
              {!m.visible && (
                <Badge tone="neutral">
                  <EyeOff aria-hidden /> Hidden
                </Badge>
              )}
              {m.isAuthor && (
                <Badge tone="info">
                  <PenLine aria-hidden /> Author
                </Badge>
              )}
            </span>
            <span className="flex items-center">
              <button type="button" data-move={`${m.id}-up`} disabled={i === 0 || saving} onClick={() => move(i, i - 1, 'up')} aria-label={`Move ${m.name} up`} className="grid size-9 cursor-pointer place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring disabled:cursor-default disabled:opacity-30">
                <ArrowUp className="size-4" aria-hidden />
              </button>
              <button type="button" data-move={`${m.id}-down`} disabled={i === items.length - 1 || saving} onClick={() => move(i, i + 1, 'down')} aria-label={`Move ${m.name} down`} className="grid size-9 cursor-pointer place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring disabled:cursor-default disabled:opacity-30">
                <ArrowDown className="size-4" aria-hidden />
              </button>
              <Link href={`/admin/team/${m.id}`} aria-label={`Edit ${m.name}`} className="grid size-9 place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring">
                <Pencil className="size-4" aria-hidden />
              </Link>
              <ConfirmDelete label={`Remove ${m.name}`} title="Remove this person?" description={`${m.name} is removed from the About page for good. To keep the profile, hide it instead.`} action={deleteTeamMember.bind(null, m.id)} onDone={() => setItems((all) => all.filter((x) => x.id !== m.id))} />
            </span>
          </li>
        ))}
      </ol>
      <p role="status" className="sr-only">
        {announce}
      </p>
    </>
  );
}
