'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { chipClassName } from '@/components/ui/chip-styles';

type Option = { value: string; label: string };

/**
 * Single-select chips as native radio buttons: arrow keys move the choice,
 * screen readers announce "radio, 2 of 4". Looks like Figma Chip 12:2799.
 */
export function ChipRadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  legendClassName,
  className,
}: {
  name: string;
  legend: React.ReactNode;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  legendClassName?: string;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className={legendClassName}>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <label key={o.value} className="relative">
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="peer absolute inset-0 cursor-pointer opacity-0"
              />
              <span className={cn(chipClassName(checked), 'pointer-events-none peer-focus-visible:focus-ring')}>
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
