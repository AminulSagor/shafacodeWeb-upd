'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { addNote } from '@/actions/admin/pipeline';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { relativeTime } from '@/lib/admin/format';
import type { Note } from '@/lib/admin/notes';

/** Team notes with an add form. */
export function NotesPanel({
  kind,
  id,
  notes,
  label = 'Internal notes',
}: {
  kind: 'inquiry' | 'lead' | 'application';
  id: string;
  notes: Note[];
  label?: string;
}) {
  const [text, setText] = React.useState('');
  const [pending, startTransition] = React.useTransition();
  const fieldId = `${kind}-${id}-note`;
  return (
    <div className="flex flex-col gap-3">
      {notes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-field bg-surface-2 px-3.5 py-2.5">
              <p className="type-body-sm whitespace-pre-line text-fg">{n.text}</p>
              <p className="mt-1 type-caption font-normal text-fg-subtle" suppressHydrationWarning>
                {n.author} · {relativeTime(n.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <label htmlFor={fieldId} className="type-label-sm text-fg">
        {label}
      </label>
      <Textarea id={fieldId} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a note for the team…" maxLength={2000} />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="self-end"
        loading={pending}
        disabled={!text.trim()}
        onClick={() =>
          startTransition(async () => {
            const res = await addNote(kind, id, text);
            if (res.ok) {
              setText('');
              toast.success('Note added');
            } else toast.error(res.error);
          })
        }
      >
        Add note
      </Button>
    </div>
  );
}
