import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Accent } from '@/components/ui/accent';
import { SectionHeader } from '@/components/site/sections/section-header';
import { InView } from '@/components/site/in-view';
import { AdaptivePreview } from './bento/adaptive-preview';
import { CountUp } from './bento/count-up';
import { SprintTracker } from './bento/sprint-tracker';

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
      <p className="mt-3 max-w-175 type-body text-fg-muted">{body}</p>
    </div>
  );
}

const cell = 'relative flex flex-col p-card xl:p-10';
const visual = 'flex flex-col xl:min-h-75';

function BriefVisual() {
  return (
    <div className={visual}>
      <p className="type-mono-xs text-fg-subtle">Project brief · v2</p>
      <ul className="mt-4 flex flex-col gap-4">
        {brief.map((b, i) => (
          <li
            key={b}
            data-reveal
            style={{ '--reveal-i': i + 1 } as React.CSSProperties}
            className="group/item flex items-center gap-3 border-b border-line-subtle py-2 transition-[padding] duration-300 hover:pl-2"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-icon-brand transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-6">
              <Check className="size-3.5" strokeWidth={2.75} aria-hidden />
            </span>
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
      <div className="relative size-19 sm:size-22 md:size-27">
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
            className="gauge-arc transition-[stroke-dashoffset] delay-200 duration-[1400ms] ease-out"
            style={{ '--c': c } as React.CSSProperties}
          />
        </svg>
        <CountUp value={value} className="absolute inset-0 grid place-items-center type-h3 text-fg tabular" />
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
        <div data-reveal="scale" className="mt-section-head overflow-hidden rounded-card border border-line-subtle bg-surface-1">
          <div className="grid divide-line-subtle max-xl:divide-y xl:grid-cols-[7fr_5fr] xl:divide-x">
            <div className={cell} data-spotlight>
              <SprintTracker />
              <CellText
                index="01"
                title="Transparent execution"
                body="You stay updated through every milestone, decision and delivery phase, with weekly progress notes and demos."
              />
            </div>
            <div className={cell} data-spotlight>
              <BriefVisual />
              <CellText
                index="02"
                title="Intelligent research"
                body="We define the scope, features, timeline and technical direction before development starts."
              />
            </div>
          </div>
          <div className="grid divide-line-subtle border-t border-line-subtle max-xl:divide-y xl:grid-cols-[5fr_7fr] xl:divide-x">
            <div className={cell} data-spotlight>
              <LighthouseVisual />
              <CellText
                index="03"
                title="Scalable delivery"
                body="We build products that grow with your users, operations and business goals, and we measure performance before launch."
              />
            </div>
            <div className={cell} data-spotlight>
              <AdaptivePreview />
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
