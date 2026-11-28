import { cn } from '@/lib/utils';

/** Chip classes, shared by the client Chip button and server-rendered filter links. */
export function chipClassName(selected: boolean, className?: string) {
  return cn(
    'inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--chip-radius)] px-3.5 type-label-sm whitespace-nowrap select-none',
    'transition-[background-color,box-shadow,translate] duration-100 focus-visible:focus-ring active:translate-y-px',
    selected
      ? 'bg-action-primary text-fg-on-brand shadow-btn-primary hover:bg-action-primary-hover'
      : 'bg-action-secondary text-fg-muted shadow-btn-secondary hover:bg-action-secondary-hover hover:text-fg',
    className
  );
}
