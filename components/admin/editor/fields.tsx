'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type Base = { id: string; label: string; required?: boolean; optional?: boolean; helper?: React.ReactNode; error?: string; className?: string };

/** Text input; shows "n / max" when `max` is set. */
export function TextField({
  value,
  onChange,
  max,
  placeholder,
  type = 'text',
  inputMode,
  ...f
}: Base & { value: string; onChange: (v: string) => void; max?: number; placeholder?: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }) {
  return (
    <Field {...f} helper={max ? <Counter value={value} max={max} extra={f.helper} /> : f.helper}>
      {(a) => <Input {...a} type={type} inputMode={inputMode} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export function TextAreaField({
  value,
  onChange,
  max,
  placeholder,
  rows,
  ...f
}: Base & { value: string; onChange: (v: string) => void; max?: number; placeholder?: string; rows?: number }) {
  return (
    <Field {...f} helper={max ? <Counter value={value} max={max} extra={f.helper} /> : f.helper}>
      {(a) => <Textarea {...a} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

function Counter({ value, max, extra }: { value: string; max: number; extra?: React.ReactNode }) {
  const over = value.length > max;
  return (
    <span className={cn(over && 'text-fg-danger')}>
      {extra ? <>{extra} · </> : null}
      {value.length} / {max} characters
    </span>
  );
}

export function SelectField<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  ...f
}: Base & { value: T | ''; onChange: (v: T) => void; options: readonly { value: T; label: string }[]; placeholder?: string }) {
  return (
    <Field {...f}>
      {(a) => (
        <NativeSelect {...a} value={value} onChange={(e) => onChange(e.target.value as T)}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
      )}
    </Field>
  );
}

export function SwitchField({ id, label, checked, onChange, helper }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; helper?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={helper ? `${id}-help` : undefined} />
      <span className="flex flex-col">
        <label htmlFor={id} className="cursor-pointer type-body-sm text-fg">
          {label}
        </label>
        {helper && (
          <span id={`${id}-help`} className="type-caption font-normal text-fg-subtle">
            {helper}
          </span>
        )}
      </span>
    </div>
  );
}

/** Tags or stack items: type and press Enter or comma. */
export function ChipsField({ id, label, value, onChange, placeholder, helper, max = 20 }: { id: string; label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; helper?: string; max?: number }) {
  const [draft, setDraft] = React.useState('');
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    onChange([...new Set([...value, ...parts])].slice(0, max));
    setDraft('');
  };
  return (
    <Field id={id} label={label} helper={helper}>
      {(a) => (
        <div className="flex flex-col gap-2">
          {value.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label={label}>
              {value.map((v) => (
                <li key={v} className="flex items-center gap-1 rounded-chip bg-surface-2 py-1 pr-1 pl-2.5 type-label-xs text-fg">
                  {v}
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((x) => x !== v))}
                    aria-label={`Remove ${v}`}
                    className="grid size-5 cursor-pointer place-items-center rounded-full hover:bg-hover focus-visible:focus-ring"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Input
            {...a}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={add}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                add();
              } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
            }}
          />
        </div>
      )}
    </Field>
  );
}

/** Ordered list of strings (responsibilities, requirements) with add, remove and reorder. */
export function ListField({ id, label, value, onChange, placeholder, max = 20 }: { id: string; label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number }) {
  const set = (i: number, v: string) => onChange(value.map((x, j) => (j === i ? v : x)));
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">{label}</legend>
      {value.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input id={`${id}-${i}`} aria-label={`${label} ${i + 1}`} value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} className="flex-1" />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
      {value.length < max && (
        <button
          type="button"
          onClick={() => onChange([...value, ''])}
          className="flex w-fit cursor-pointer items-center gap-1.5 rounded-sm type-label-sm text-fg-brand hover:text-fg-brand-hover focus-visible:focus-ring"
        >
          <Plus className="size-4" aria-hidden /> Add item
        </button>
      )}
    </fieldset>
  );
}

/** Value and label rows (results / metrics). Figma: Results card */
export function PairsField({
  value,
  onChange,
  max = 3,
}: {
  value: { value: string; label: string }[];
  onChange: (v: { value: string; label: string }[]) => void;
  max?: number;
}) {
  const set = (i: number, k: 'value' | 'label', v: string) => onChange(value.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="flex flex-col gap-3">
      {value.map((r, i) => (
        <div key={i} className="grid grid-cols-[--spacing(28)_minmax(0,1fr)_auto] items-end gap-3">
          <label className="flex flex-col gap-2">
            <span className="type-label-sm text-fg">Value</span>
            <Input value={r.value} maxLength={12} placeholder="2x" onChange={(e) => set(i, 'value', e.target.value)} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="type-label-sm text-fg">Label</span>
            <Input value={r.label} maxLength={60} placeholder="More course enquiries" onChange={(e) => set(i, 'label', e.target.value)} />
          </label>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`Remove metric ${i + 1}`}
            className="grid size-10 cursor-pointer place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
      {value.length < max && (
        <button
          type="button"
          onClick={() => onChange([...value, { value: '', label: '' }])}
          className="flex w-fit cursor-pointer items-center gap-1.5 rounded-sm type-label-sm text-fg-brand hover:text-fg-brand-hover focus-visible:focus-ring"
        >
          <Plus className="size-4" aria-hidden /> Add metric
        </button>
      )}
    </div>
  );
}

/** Warns before closing the tab or following a link with unsaved changes. */
export function useUnsavedWarning(dirty: boolean) {
  React.useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (!window.confirm('You have unsaved changes. Leave without saving?')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onClick, true);
    };
  }, [dirty]);
}
