'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import type { ActionResult } from '@/lib/admin/action';
import { useUnsavedWarning } from './fields';

/**
 * Editor state: values, dirty tracking against the last save, field errors,
 * save through a server action, and the redirect to the new item's URL.
 */
export function useEditor<T>({
  id,
  initial,
  savedAt: initialSavedAt,
  base,
  action,
}: {
  id: string | null;
  initial: T;
  savedAt: string;
  base: string;
  action: (id: string | null, value: T) => Promise<ActionResult<{ id: string }>>;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(initial);
  const [snapshot, setSnapshot] = React.useState(() => JSON.stringify(initial));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = React.useState(initialSavedAt);
  const [saving, startSaving] = React.useTransition();
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const dirty = JSON.stringify(value) !== snapshot;
  useUnsavedWarning(dirty);

  const set = <K extends keyof T>(k: K, v: T[K]) => setValue((s) => ({ ...s, [k]: v }));
  const save = (override?: Partial<T>) =>
    startSaving(async () => {
      const payload = { ...value, ...override };
      const res = await action(id, payload);
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setErrors({});
      setValue(payload);
      setSnapshot(JSON.stringify(payload));
      setSavedAt(new Date().toISOString());
      toast.success(res.message ?? 'Saved');
      if (!id && res.data) router.replace(`${base}/${res.data.id}`);
      else router.refresh();
    });

  return { value, setValue, set, errors, dirty, saving, savedAt, save, summaryRef };
}

/** List of field errors that takes focus after a failed save. */
export function ErrorSummary({ errors, summaryRef }: { errors: Record<string, string>; summaryRef: React.RefObject<HTMLDivElement | null> }) {
  const list = [...new Set(Object.values(errors))];
  if (!list.length) return null;
  return (
    <div ref={summaryRef} tabIndex={-1} className="flex items-start gap-2.5 rounded-field bg-status-danger p-4 type-body-sm text-fg-danger outline-none">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="type-label-sm">Fix these before saving:</p>
        <ul className="mt-1 list-disc pl-5">
          {list.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
