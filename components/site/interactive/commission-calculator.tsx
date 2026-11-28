'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';

import { ChipRadioGroup } from '@/components/ui/chip-radio-group';
import { commissionFor } from '@/content/affiliate';

const PRESETS = [100_000, 200_000, 500_000];
const k = (n: number) => `৳${Math.round(n / 1000)}k`;

/**
 * Project value slider with presets; the payout range updates live in an
 * <output>. Figma: Commission Calculator 52:8347
 */
export function CommissionCalculator() {
  const [value, setValue] = React.useState(200_000);
  const { low, high } = commissionFor(value);
  const id = React.useId();
  return (
    <section aria-labelledby={`${id}-title`} className="rounded-card border border-line-subtle bg-surface-1 p-card md:p-6">
      <h3 id={`${id}-title`} className="type-h5 text-fg">
        Commission calculator
      </h3>
      <ChipRadioGroup
        className="mt-4"
        name={`${id}-preset`}
        legend="Project value"
        legendClassName="type-mono-xs text-fg-subtle"
        options={PRESETS.map((p) => ({ value: String(p), label: k(p) }))}
        value={PRESETS.includes(value) ? String(value) : ''}
        onChange={(v) => setValue(Number(v))}
      />
      <Slider.Root
        className="relative mt-5 flex h-6 w-full touch-none items-center select-none"
        min={50_000}
        max={1_000_000}
        step={10_000}
        value={[value]}
        onValueChange={([v]) => setValue(v)}
      >
        <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-surface-2">
          <Slider.Range className="absolute h-full rounded-full bg-action-primary" />
        </Slider.Track>
        <Slider.Thumb
          aria-label="Project value in taka"
          aria-valuetext={`${k(value)} project`}
          className="block size-5 cursor-grab rounded-full bg-action-primary shadow-btn-primary focus-visible:focus-ring active:cursor-grabbing"
        />
      </Slider.Root>
      <output aria-live="polite" aria-atomic="true" className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 sm:flex-nowrap">
        <span className="shrink-0 type-stat text-fg-brand tabular">
          {k(low)} – {Math.round(high / 1000)}k
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="type-label-sm text-fg">
            Your estimated commission<span className="sr-only"> on a {k(value)} project</span>
          </span>
          <span className="type-caption font-normal text-fg-subtle">4% to 6% of the project value, paid when the project starts.</span>
        </span>
      </output>
    </section>
  );
}
