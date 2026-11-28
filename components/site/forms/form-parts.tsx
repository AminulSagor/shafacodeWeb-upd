'use client';

import * as React from 'react';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

/** Field name of the honeypot input; the actions read it as `website`. */
export const HONEYPOT = 'sc_hp';

/**
 * Bot trap: off screen and out of the tab order. Its name and label avoid
 * words that browsers or password managers autofill.
 */
export function Honeypot({ id }: { id: string }) {
  return (
    <div aria-hidden className="absolute -left-2500 h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

/**
 * Error summary that takes focus, which makes screen readers read it once on
 * every failed submit (no role="alert", that would read it twice).
 */
export const FormAlert = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(function FormAlert(
  { children, className },
  ref
) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn('flex items-start gap-2.5 rounded-sm bg-status-danger p-4 type-body-sm text-fg-danger outline-none', className)}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
});

/** Consent checkbox; the privacy link sits outside the label (no links inside labels). */
export function ConsentField({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3 type-body-sm text-fg-muted">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5"
        />
        <p>
          <label htmlFor={id} className="cursor-pointer">
            {children}
          </label>{' '}
          See the{' '}
          <Link href="/privacy-policy" className="rounded-sm text-fg-brand underline underline-offset-4 focus-visible:focus-ring">
            privacy policy
          </Link>
          .
        </p>
      </div>
      {error && (
        <p id={errorId} className="type-caption text-fg-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** First message per field from a zod error. */
export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) out[String(issue.path[0])] ??= issue.message;
  return out;
}
