'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChipRadioGroup } from '@/components/ui/chip-radio-group';
import {
  estimate,
  estimatorFeatures,
  formatBdtK,
  formatUsd,
  projectTypes,
  type FeatureId,
  type ProjectTypeId,
} from '@/content/pricing';

/**
 * Instant estimate: project type + must-have features give a price range,
 * duration and team shape from the typed table in content/pricing.ts.
 * "Send this scope" pre-fills the contact form. Figma: Scope Estimator 42:3502
 */
export function ScopeEstimator({ className }: { className?: string }) {
  const [type, setType] = React.useState<ProjectTypeId>('web-app');
  const [features, setFeatures] = React.useState<FeatureId[]>(['accounts', 'admin', 'payments', 'integrations']);
  const shown = React.useMemo(() => estimate(type, features), [type, features]);
  const uid = React.useId();

  const toggle = (id: FeatureId, on: boolean) =>
    setFeatures((f) => (on ? [...new Set([...f, id])] : f.filter((x) => x !== id)));

  // A mobile-app project already is the app: do not send the add-on twice.
  const sentFeatures = features.filter((f) => !(type === 'mobile-app' && f === 'mobile'));
  const params = new URLSearchParams({ type, source: 'estimator' });
  if (sentFeatures.length) params.set('features', sentFeatures.join(','));
  const titleId = `${uid}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'rounded-card border border-line-subtle bg-surface-1 p-card md:p-6',
        className
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 id={titleId} className="type-h4 text-fg">
          Instant estimate
        </h3>
        <p className="type-caption font-normal text-fg-subtle">Ballpark, not a quote</p>
      </div>

      <ChipRadioGroup
        className="mt-5"
        name={`${uid}-type`}
        legend="1 · What are you building?"
        legendClassName="type-mono-xs text-fg-subtle"
        options={projectTypes.map((p) => ({ value: p.id, label: p.label }))}
        value={type}
        onChange={(v) => setType(v as ProjectTypeId)}
      />

      <fieldset className="mt-5">
        <legend className="type-mono-xs text-fg-subtle">2 · Must-haves</legend>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
          {estimatorFeatures.map((f) => {
            const id = `${uid}-${f.id}`;
            const disabled = type === 'mobile-app' && f.id === 'mobile';
            return (
              <label key={f.id} htmlFor={id} className={cn('flex cursor-pointer items-center gap-2.5 type-body-sm text-fg', disabled && 'cursor-not-allowed opacity-50')}>
                <Checkbox
                  id={id}
                  checked={features.includes(f.id) || disabled}
                  disabled={disabled}
                  onCheckedChange={(v) => toggle(f.id, v === true)}
                />
                {f.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <output aria-live="polite" aria-atomic="true" className="mt-5 block border-t border-line-subtle pt-5">
        <span className="block type-mono-xs text-fg-brand">Estimated range</span>
        <span className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="type-stat text-fg">
            <span className="font-sans font-semibold">৳</span>
            {formatBdtK(shown.low)} – {formatBdtK(shown.high)}
          </span>
          <span className="type-body-sm text-fg-subtle tabular">
            ≈ {formatUsd(shown.low)} – {formatUsd(shown.high).replace('$', '')}
          </span>
        </span>
        <span className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
          <span className="flex flex-col">
            <span className="type-caption font-normal text-fg-subtle">Timeline</span>
            <span className="type-label-sm text-fg tabular">
              {shown.weeks[0]} to {shown.weeks[1]} weeks
            </span>
          </span>
          <span className="flex flex-col">
            <span className="type-caption font-normal text-fg-subtle">Team</span>
            <span className="type-label-sm text-fg">{shown.team.join(', ')}</span>
          </span>
        </span>
      </output>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button asChild size="md">
          <Link href={`/contact?${params.toString()}`}>
            Send this scope <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Link href="/contact" className="rounded-sm type-label text-fg hover:text-fg-brand focus-visible:focus-ring">
          Talk it through
        </Link>
      </div>
    </section>
  );
}
