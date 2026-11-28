'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';

import { ChipRadioGroup } from '@/components/ui/chip-radio-group';
import { commissionFor } from '@/content/affiliate';

const PRESETS = [100_000, 200_000, 500_000];
const k = (n: number) => `৳${Math.round(n / 1000)}k`;
/** ৳8k, ৳2.5k, ৳12k: one decimal only when the amount is not a whole thousand. */
const money = (n: number) => `৳${Number((n / 1000).toFixed(n % 1000 ? 1 : 0))}k`;
const pct = (r: number) => `${Math.round(r * 100)}%`;

/**
 * Project value slider with presets; the payout range updates live in an
 * <output>. Figma: Commission Calculator 52:8347
 */
export function CommissionCalculator() {
  const [value, setValue] = React.useState(200_000);
  const { low, high, lowRate, highRate } = commissionFor(value);
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
      <div className="mt-5 flex items-center gap-4">
        <Slider.Root
          className="relative flex h-6 flex-1 touch-none items-center select-none"
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
            className="block size-6 cursor-grab rounded-full bg-action-primary shadow-btn-primary focus-visible:focus-ring active:cursor-grabbing"
          />
        </Slider.Root>
        <span className="w-14 shrink-0 text-right type-label-sm text-fg tabular">{k(value)}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 sm:flex-nowrap">
        <output aria-live="polite" aria-atomic="true" className="shrink-0 type-stat text-fg-brand tabular">
          {money(low)} – {money(high).slice(1)}
          <span className="sr-only"> on a {k(value)} project</span>
        </output>
        <span className="flex min-w-0 flex-col">
          <span className="type-label-sm text-fg">Your estimated commission</span>
          <span className="type-caption font-normal text-fg-subtle">
            {pct(lowRate)} to {pct(highRate)} of the project value, paid when the project starts.
          </span>
        </span>
      </div>
    </section>
  );
}
