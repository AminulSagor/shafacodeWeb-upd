'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Filter chip: a toggle button with aria-pressed, styled as a small secondary
 * button; the selected chip is primary. Figma: Chip 12:2799
 */
function Chip({
  selected = false,
  className,
  ...props
}: React.ComponentProps<'button'> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--chip-radius)] px-3.5 type-label-sm whitespace-nowrap select-none',
        'transition-[background-color,box-shadow,translate] duration-100 focus-visible:focus-ring active:translate-y-px',
        selected
          ? 'bg-action-primary text-fg-on-brand shadow-btn-primary hover:bg-action-primary-hover'
          : 'bg-action-secondary text-fg-muted shadow-btn-secondary hover:bg-action-secondary-hover hover:text-fg',
        className
      )}
      {...props}
    />
  );
}

/** Link styled as a chip (for URL-driven filters that must work without JS). */
function chipClassName(selected: boolean, className?: string) {
  return cn(
    'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[var(--chip-radius)] px-3.5 type-label-sm whitespace-nowrap',
    'transition-[background-color,box-shadow,translate] duration-100 focus-visible:focus-ring active:translate-y-px',
    selected
      ? 'bg-action-primary text-fg-on-brand shadow-btn-primary hover:bg-action-primary-hover'
      : 'bg-action-secondary text-fg-muted shadow-btn-secondary hover:bg-action-secondary-hover hover:text-fg',
    className
  );
}

export { Chip, chipClassName };
