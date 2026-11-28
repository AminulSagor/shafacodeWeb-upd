'use client';

import * as React from 'react';
import { LazyMotion, animate, domMax, m, useMotionValue, useTransform, type MotionValue } from 'motion/react';

import { processSteps } from '@/content/process';
import { ANCHORS, BOX, CORE, NODES, SUCKERS, pathD, pointAt, tentacle } from './geometry';
import { CoreDisc, DragHint, Rings, StepCard } from './parts';

const SPRING = { type: 'spring', stiffness: 180, damping: 12 } as const;
const LIMIT = 120;
const CONSTRAINTS = { left: -LIMIT, right: LIMIT, top: -LIMIT, bottom: LIMIT };

type XY = { x: MotionValue<number>; y: MotionValue<number> };

function springHome(v: XY) {
  animate(v.x, 0, SPRING);
  animate(v.y, 0, SPRING);
}

/** One tentacle, recomputed from the hub and card offsets on every frame (no React re-render). */
function Tentacle({ index, hub, node, active }: { index: number; hub: XY; node: XY; active: boolean }) {
  const geo = useTransform(() =>
    tentacle(
      { x: CORE.x + hub.x.get(), y: CORE.y + hub.y.get() },
      { x: ANCHORS[index].x + node.x.get(), y: ANCHORS[index].y + node.y.get() }
    )
  );
  const d = useTransform(() => pathD(geo.get()));
  return (
    <g>
      <m.path d={d} fill="none" stroke="var(--action-primary)" strokeWidth={active ? 10 : 7} strokeOpacity={active ? 0.3 : 0.16} strokeLinecap="round" />
      <m.path d={d} fill="none" stroke="var(--action-primary)" strokeWidth={active ? 3 : 2} strokeLinecap="round" />
      {SUCKERS.map((s) => (
        <Sucker key={s.s} geo={geo} s={s.s} r={s.r} />
      ))}
    </g>
  );
}

function Sucker({ geo, s, r }: { geo: MotionValue<ReturnType<typeof tentacle>>; s: number; r: number }) {
  const cx = useTransform(() => pointAt(geo.get(), s).x);
  const cy = useTransform(() => pointAt(geo.get(), s).y);
  return <m.circle cx={cx} cy={cy} r={r} fill="var(--action-primary)" />;
}

/**
 * Kinetic Core (Figma 39:3460): drag the core or any stage; tentacles follow
 * and everything springs back on release. Stages are a roving-tabindex list:
 * arrow keys move between them, focus or hover highlights the tentacle.
 */
export function KineticCore() {
  const hub = { x: useMotionValue(0), y: useMotionValue(0) };
  const nodes: XY[] = [
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
  ];
  const [active, setActive] = React.useState<number | null>(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const items = React.useRef<(HTMLLIElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = processSteps.length;
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setFocusIndex(next);
    items.current[next]?.focus();
  };

  return (
    <LazyMotion features={domMax} strict>
      <div className="relative mx-auto h-190 w-310 select-none">
        <Rings />
        <svg aria-hidden viewBox={`0 0 ${BOX.w} ${BOX.h}`} className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {nodes.map((node, i) => (
            <Tentacle key={i} index={i} hub={hub} node={node} active={active === i} />
          ))}
        </svg>

        <m.div
          aria-hidden
          className="absolute top-68 left-123 size-64 rounded-full border border-line-brand bg-brand-soft"
          style={{ x: hub.x, y: hub.y }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 1.6, repeat: 2, ease: 'easeInOut' }} // finite: stops within 5s (WCAG 2.2.2)
        />
        <m.div
          className="absolute top-76 left-131 cursor-grab rounded-full active:cursor-grabbing"
          style={{ x: hub.x, y: hub.y }}
          drag
          dragElastic={0.2}
          dragMomentum={false}
          dragConstraints={CONSTRAINTS}
          onDragEnd={() => springHome(hub)}
          whileDrag={{ scale: 1.04 }}
        >
          <CoreDisc />
        </m.div>

        <ol aria-label="Process stages">
          {processSteps.map((step, i) => (
            <m.li
              key={step.title}
              ref={(el) => {
                items.current[i] = el;
              }}
              tabIndex={focusIndex === i ? 0 : -1}
              aria-current={active === i ? 'step' : undefined}
              className="absolute cursor-grab rounded-md focus-visible:focus-ring active:cursor-grabbing"
              style={{ left: NODES[i].x, top: NODES[i].y, width: NODES[i].w, x: nodes[i].x, y: nodes[i].y }}
              drag
              dragElastic={0.2}
              dragMomentum={false}
              dragConstraints={CONSTRAINTS}
              onDragEnd={() => springHome(nodes[i])}
              whileDrag={{ scale: 1.03, zIndex: 10 }}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive((a) => (a === i ? null : a))}
              onFocus={() => {
                setActive(i);
                setFocusIndex(i);
              }}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <StepCard step={step} index={i} active={active === i} />
            </m.li>
          ))}
        </ol>
        <DragHint />
      </div>
    </LazyMotion>
  );
}
