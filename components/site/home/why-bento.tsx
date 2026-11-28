import Image from 'next/image';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Accent } from '@/components/ui/accent';
import { SectionHeader } from '@/components/site/sections/section-header';
import { InView } from '@/components/site/in-view';

const sprints = [
  { label: 'UI design & prototype', status: 'Done' },
  { label: 'Sprint 2 · Auth & dashboard', status: 'Done' },
  { label: 'Sprint 3 · Payments & orders', status: 'In progress' },
  { label: 'Sprint 4 · Reports', status: 'Next' },
] as const;

const brief = ['Goals & success metrics', 'Feature list & user roles', 'Timeline with milestones', 'Fixed estimate & tech stack'];

const scores = [
  { label: 'Performance', value: 98 },
  { label: 'Accessibility', value: 100 },
  { label: 'SEO', value: 100 },
];

function CellText({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="mt-7 flex flex-col">
      <p className="type-mono-xs text-fg-brand">[ {index} ]</p>
      <h3 className="mt-3 type-h3 text-fg">{title}</h3>
      <p className="mt-3 max-w-[700px] type-body text-fg-muted">{body}</p>
    </div>
  );
}

const cell = 'flex flex-col p-[var(--card-pad)] xl:p-10';
const visual = 'flex flex-col xl:min-h-[300px]';

function ProgressVisual() {
  return (
    <InView className={cn(visual, 'group')}>
      <div className="flex items-end justify-between gap-4">
        <p className="type-stat text-fg">62%</p>
        <div className="text-right">
          <p className="type-mono-xs text-fg-brand">Sprint 3 of 4</p>
          <p className="mt-1 type-body-sm text-fg">Payments &amp; orders</p>
        </div>
      </div>
      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2"
        role="img"
        aria-label="Project 62% complete"
      >
        <div className="h-full w-[62%] origin-left rounded-full bg-action-primary transition-transform delay-150 duration-[1200ms] ease-[var(--ease-out)] group-data-[inview=false]:scale-x-0" />
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {sprints.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-4 border-b border-line-subtle pb-2">
            <span className="type-body-sm text-fg">{s.label}</span>
            <span
              className={cn(
                'shrink-0 type-mono-xs',
                s.status === 'Done' && 'text-fg-success',
                s.status === 'In progress' && 'text-fg-brand',
                s.status === 'Next' && 'text-fg-subtle'
              )}
            >
              {s.status}
            </span>
          </li>
        ))}
      </ul>
    </InView>
  );
}

function BriefVisual() {
  return (
    <div className={visual}>
      <p className="type-mono-xs text-fg-subtle">Project brief · v2</p>
      <ul className="mt-4 flex flex-col gap-4">
        {brief.map((b) => (
          <li key={b} className="flex items-center gap-3 border-b border-line-subtle py-2">
            <Check className="size-[18px] shrink-0 text-icon-brand" strokeWidth={2.25} aria-hidden />
            <span className="type-body-lg text-fg">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Gauge({ label, value }: { label: string; value: number }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  return (
    <figure className="flex flex-col items-center gap-3.5">
      <div className="relative size-[76px] sm:size-[88px] md:size-[108px]">
        <svg viewBox="0 0 108 108" className="size-full -rotate-90" aria-hidden>
          <circle cx="54" cy="54" r={r} fill="none" stroke="var(--line-subtle)" strokeWidth="4" />
          <circle
            cx="54"
            cy="54"
            r={r}
            fill="none"
            stroke="var(--action-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
            className="transition-[stroke-dashoffset] delay-200 duration-[1400ms] ease-[var(--ease-out)] group-data-[inview=false]:[stroke-dashoffset:var(--c)]"
            style={{ '--c': c } as React.CSSProperties}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center type-h3 text-fg tabular">{value}</span>
      </div>
      <figcaption className="type-mono-xs text-fg-brand">{label}</figcaption>
    </figure>
  );
}

function LighthouseVisual() {
  return (
    <InView className={cn(visual, 'group')}>
      <p className="type-mono-xs text-fg-subtle">Lighthouse · measured before launch</p>
      <div className="flex flex-1 items-center justify-between gap-2 py-8 sm:gap-4 xl:py-0">
        {scores.map((s) => (
          <Gauge key={s.label} {...s} />
        ))}
      </div>
    </InView>
  );
}

/** Figma: Why ShafaCode 92:19173 (bento, one hairline grid of four cells) */
export function WhyBento() {
  return (
    <section aria-labelledby="why-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="why-title"
          eyebrow="Why ShafaCode"
          title={
            <>
              Get your software <Accent>without the guesswork</Accent>
            </>
          }
          lede="Many businesses struggle with unclear timelines, poor communication, weak UI/UX and teams that disappear after delivery. We combine product planning, transparent development and long-term technical support."
        />
        <div className="mt-[var(--section-head-gap)] overflow-hidden rounded-[var(--card-radius)] border border-line-subtle bg-surface-1">
          <div className="grid divide-line-subtle max-xl:divide-y xl:grid-cols-[7fr_5fr] xl:divide-x">
            <div className={cell}>
              <ProgressVisual />
              <CellText
                index="01"
                title="Transparent execution"
                body="You stay updated through every milestone, decision and delivery phase, with weekly progress notes and demos."
              />
            </div>
            <div className={cell}>
              <BriefVisual />
              <CellText
                index="02"
                title="Intelligent research"
                body="We define the scope, features, timeline and technical direction before development starts."
              />
            </div>
          </div>
          <div className="grid divide-line-subtle border-t border-line-subtle max-xl:divide-y xl:grid-cols-[5fr_7fr] xl:divide-x">
            <div className={cell}>
              <LighthouseVisual />
              <CellText
                index="03"
                title="Scalable delivery"
                body="We build products that grow with your users, operations and business goals, and we measure performance before launch."
              />
            </div>
            <div className={cell}>
              <div className={cn('relative flex aspect-[16/9] flex-col overflow-hidden rounded-md xl:aspect-auto xl:h-[300px]')}>
                <Image
                  src="/images/home/adaptive-ux.jpg"
                  alt="Hands using a responsive analytics dashboard on a laptop, tablet and phone with lime charts"
                  fill
                  sizes="(min-width: 1280px) 700px, 92vw"
                  className="object-cover"
                />
              </div>
              <CellText
                index="04"
                title="Adaptive user experience"
                body="Interfaces that feel simple for users and powerful enough for growing business needs, on every screen size."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
