'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChipRadioGroup } from '@/components/ui/chip-radio-group';
import { AnimatedNumber } from './animated-number';
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
  // Hover previews: what the estimate would be with this type or this feature toggled.
  const [previewType, setPreviewType] = React.useState<ProjectTypeId | null>(null);
  const [previewFeature, setPreviewFeature] = React.useState<FeatureId | null>(null);
  // Self-running demo while the card is on screen and nobody has touched it.
  const [demo, setDemo] = React.useState(true);
  const [demoIndex, setDemoIndex] = React.useState<number | null>(null);
  const ref = React.useRef<HTMLElement>(null);

  const committed = React.useMemo(() => estimate(type, features), [type, features]);
  const viewType = previewType ?? (demo && demoIndex !== null ? projectTypes[demoIndex].id : type);
  const viewFeatures = previewFeature
    ? features.includes(previewFeature)
      ? features.filter((f) => f !== previewFeature)
      : [...features, previewFeature]
    : features;
  const shown = estimate(viewType, viewFeatures);
  const previewing = viewType !== type || viewFeatures.length !== features.length;
  const uid = React.useId();

  React.useEffect(() => {
    if (!demo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) setDemoIndex(null);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    const id = window.setInterval(() => {
      if (visible) setDemoIndex((i) => (i === null ? 0 : (i + 1) % projectTypes.length));
    }, 2600);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [demo]);
  const stopDemo = () => {
    if (!demo) return;
    setDemo(false);
    setDemoIndex(null);
  };

  const toggle = (id: FeatureId, on: boolean) =>
    setFeatures((f) => (on ? [...new Set([...f, id])] : f.filter((x) => x !== id)));
  const scale = 800_000;

  // A mobile-app project already is the app: do not send the add-on twice.
  const sentFeatures = features.filter((f) => !(type === 'mobile-app' && f === 'mobile'));
  const params = new URLSearchParams({ type, source: 'estimator' });
  if (sentFeatures.length) params.set('features', sentFeatures.join(','));
  const titleId = `${uid}-title`;

  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      onPointerEnter={stopDemo}
      onFocus={stopDemo}
      data-spotlight
      className={cn(
        'relative rounded-card border border-line-subtle bg-surface-1 p-card md:p-6',
        className
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 id={titleId} className="type-h4 text-fg">
          Instant estimate
        </h3>
        <p className="flex items-center gap-2 type-caption font-normal text-fg-subtle">
          {demo && demoIndex !== null ? (
            <>
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-action-primary" /> Live demo, hover to try
            </>
          ) : previewing ? (
            <span className="text-fg-brand">Preview</span>
          ) : (
            'Ballpark, not a quote'
          )}
        </p>
      </div>

      <ChipRadioGroup
        className="mt-5"
        name={`${uid}-type`}
        legend="1 · What are you building?"
        legendClassName="type-mono-xs text-fg-subtle"
        options={projectTypes.map((p) => ({ value: p.id, label: p.label }))}
        value={demo && demoIndex !== null ? viewType : type}
        onChange={(v) => setType(v as ProjectTypeId)}
        onPreview={(v) => setPreviewType(v as ProjectTypeId | null)}
      />

      <fieldset className="mt-5">
        <legend className="type-mono-xs text-fg-subtle">2 · Must-haves</legend>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
          {estimatorFeatures.map((f) => {
            const id = `${uid}-${f.id}`;
            const disabled = type === 'mobile-app' && f.id === 'mobile';
            return (
              <label
                key={f.id}
                htmlFor={id}
                onPointerEnter={() => !disabled && setPreviewFeature(f.id)}
                onPointerLeave={() => setPreviewFeature(null)}
                className={cn('flex cursor-pointer items-center gap-2.5 type-body-sm text-fg', disabled && 'cursor-not-allowed opacity-50')}
              >
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

      {/* Screen readers hear the chosen estimate, not every hover preview. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        Estimated range ৳{formatBdtK(committed.low)} to ৳{formatBdtK(committed.high)}, {committed.weeks[0]} to {committed.weeks[1]} weeks, team: {committed.team.join(', ')}.
      </p>
      <div aria-hidden className={cn('mt-5 block border-t border-line-subtle pt-5 transition-opacity', previewing && 'opacity-90')}>
        <span className="block type-mono-xs text-fg-brand">Estimated range</span>
        <span className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="type-stat text-fg tabular">
            <span className="font-sans font-semibold">৳</span>
            <AnimatedNumber value={shown.low} format={(n) => formatBdtK(n)} /> – <AnimatedNumber value={shown.high} format={(n) => formatBdtK(n)} />
          </span>
          <span className="type-body-sm text-fg-subtle tabular">
            ≈ {formatUsd(shown.low)} – {formatUsd(shown.high).replace('$', '')}
          </span>
        </span>
        {/* Where the range sits on a 0 to ৳800k scale */}
        <span className="relative mt-3 block h-1.5 overflow-hidden rounded-full bg-surface-2">
          <span
            className="absolute inset-y-0 rounded-full bg-action-primary transition-[left,width] duration-500 ease-out"
            style={{ left: `${Math.min(100, (shown.low / scale) * 100)}%`, width: `${Math.max(2, Math.min(100, ((shown.high - shown.low) / scale) * 100))}%` }}
          />
        </span>
        <span className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
          <span className="flex flex-col">
            <span className="type-caption font-normal text-fg-subtle">Timeline</span>
            <span className="type-label-sm text-fg tabular">
              <AnimatedNumber value={shown.weeks[0]} format={(n) => String(Math.round(n))} /> to <AnimatedNumber value={shown.weeks[1]} format={(n) => String(Math.round(n))} /> weeks
            </span>
          </span>
          <span className="flex flex-col">
            <span className="type-caption font-normal text-fg-subtle">Team</span>
            <span className="flex flex-wrap gap-1.5">
              {shown.team.map((m) => (
                <span key={m} className="animate-fade-up rounded-chip bg-surface-2 px-2 py-0.5 type-label-xs text-fg motion-reduce:animate-none">
                  {m}
                </span>
              ))}
            </span>
          </span>
        </span>
      </div>

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
