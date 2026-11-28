'use client';

import * as React from 'react';

import { chipClassName } from '@/components/ui/chip-styles';

/**
 * Filter chip: a toggle button with aria-pressed, styled as a small secondary
 * button; the selected chip is primary. Figma: Chip 12:2799
 */
function Chip({ selected = false, className, ...props }: React.ComponentProps<'button'> & { selected?: boolean }) {
  return <button type="button" aria-pressed={selected} className={chipClassName(selected, className)} {...props} />;
}

export { Chip };
