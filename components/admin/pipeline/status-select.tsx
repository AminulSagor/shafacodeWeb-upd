'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { NativeSelect } from '@/components/ui/native-select';
import type { ActionResult } from '@/lib/admin/action';

/**
 * Status that saves on change, with an Undo in the toast (status changes are
 * reversible, so they get Undo instead of a confirm). Key it by the saved
 * value so a server refresh resets it.
 */
export function StatusSelect({
  id,
  label,
  value,
  options,
  save,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  save: (next: string) => Promise<ActionResult<string>>;
}) {
  const [current, setCurrent] = React.useState(value);
  const [pending, startTransition] = React.useTransition();

  const apply = (next: string, undo = false) =>
    startTransition(async () => {
      const before = current;
      setCurrent(next);
      const res = await save(next);
      if (!res.ok) {
        setCurrent(before);
        toast.error(res.error);
        return;
      }
      if (undo) return void toast.success('Change undone');
      const previous = res.data ?? before;
      toast.success(res.message ?? 'Saved', {
        action: previous !== next ? { label: 'Undo', onClick: () => apply(previous, true) } : undefined,
      });
    });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-label-sm text-fg">
        {label}
      </label>
      <NativeSelect id={id} value={current} disabled={pending} onChange={(e) => apply(e.target.value)} aria-busy={pending || undefined}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
