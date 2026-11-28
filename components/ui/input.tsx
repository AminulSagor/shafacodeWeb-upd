import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Recessed field (Figma Field 13:2606): inset hairline + soft inner shadow,
 * focus swaps it for a 2px lime inset, aria-invalid for a red one.
 * 16px text on mobile so iOS does not zoom.
 */
export const fieldBase = [
  'w-full min-w-0 rounded-field bg-field text-fg shadow-field',
  'type-body',
  'placeholder:text-fg-subtle',
  'transition-[box-shadow,background-color] duration-100 outline-none',
  'focus-visible:shadow-field-focus aria-invalid:shadow-field-error aria-invalid:focus-visible:shadow-field-error',
  'disabled:cursor-not-allowed disabled:opacity-45',
].join(' ');

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldBase,
        'h-control truncate px-3.5',
        'file:mr-3 file:h-7 file:rounded-md file:border-0 file:bg-surface-2 file:px-2 file:type-label-xs file:text-fg',
        className
      )}
      {...props}
    />
  );
}

export { Input };
