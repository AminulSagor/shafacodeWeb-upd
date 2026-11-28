import * as React from 'react';
import { TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';

type FieldProps = {
  /** id of the control; label, helper and error ids derive from it */
  id: string;
  label: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  helper?: React.ReactNode;
  error?: string;
  className?: string;
  /**
   * The control. It receives `id`, `aria-invalid`, `aria-describedby` and
   * `aria-required` through the render function.
   */
  children: (control: {
    id: string;
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
    'aria-required': boolean | undefined;
  }) => React.ReactNode;
};

/**
 * Visible label, required marker in text, helper and error linked with
 * aria-describedby. Figma: Field 13:2606.
 */
function Field({ id, label, required, optional, helper, error, className, children }: FieldProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <label htmlFor={id} className="type-label-sm text-fg">
        {label}
        {required && (
          <span className="text-fg-subtle">
            <span aria-hidden> *</span>
            <span className="sr-only"> (required)</span>
          </span>
        )}
        {optional && <span className="font-normal text-fg-subtle"> (optional)</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 type-caption text-fg-danger">
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="type-caption font-normal text-fg-subtle">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export { Field };
