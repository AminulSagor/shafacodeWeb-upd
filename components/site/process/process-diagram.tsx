import { processSteps } from '@/content/process';
import { ANCHORS, BOX, CORE, NODES, SUCKERS, pathD, pointAt, tentacle } from './geometry';
import { CoreDisc, Rings, StepCard } from './parts';
import { KineticCoreLoader } from './kinetic-core-loader';

/**
 * Process stages. Below 1280px: a plain grid of the six cards. From 1280px:
 * the Kinetic Core diagram, server-rendered with static curves, upgraded to
 * the draggable version when it nears the viewport (pointer devices without
 * reduced motion). The cards are the same ordered list in every mode.
 */
export function ProcessDiagram() {
  const hub = { x: CORE.x, y: CORE.y };
  const paths = ANCHORS.map((a) => tentacle(hub, a));

  const staticDiagram = (
    <div className="relative mx-auto h-[760px] w-[1240px]" data-kinetic-static>
      <Rings />
      <svg aria-hidden viewBox={`0 0 ${BOX.w} ${BOX.h}`} className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {paths.map((t, i) => (
          <g key={i}>
            <path d={pathD(t)} fill="none" stroke="var(--action-primary)" strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" />
            <path d={pathD(t)} fill="none" stroke="var(--action-primary)" strokeWidth="2" strokeLinecap="round" />
            {SUCKERS.map((s) => {
              const p = pointAt(t, s.s);
              return <circle key={s.s} cx={p.x} cy={p.y} r={s.r} fill="var(--action-primary)" />;
            })}
          </g>
        ))}
      </svg>
      <CoreDisc className="absolute top-[304px] left-[524px]" />
      <ol>
        {processSteps.map((step, i) => (
          <li key={step.title} className="absolute" style={{ left: NODES[i].x, top: NODES[i].y, width: NODES[i].w }}>
            <StepCard step={step} index={i} />
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <>
      <ol className="grid gap-[var(--grid-gap)] md:grid-cols-2 xl:hidden">
        {processSteps.map((step, i) => (
          <li key={step.title}>
            <StepCard step={step} index={i} />
          </li>
        ))}
      </ol>
      <div className="max-xl:hidden">
        <KineticCoreLoader fallback={staticDiagram} />
      </div>
    </>
  );
}
