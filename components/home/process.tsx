import {
  Bug,
  Code2,
  Compass,
  Palette,
  Rocket,
  Search,
  Waypoints,
  type LucideIcon,
} from 'lucide-react';

const steps: {
  n: string;
  title: string;
  text: string;
  tag: string;
  icon: LucideIcon;
  pos: string;
}[] = [
  {
    n: '01',
    title: 'Discovery',
    text: 'Mapping the ecosystem.',
    tag: 'LAT: 40.7128',
    icon: Search,
    pos: 'lg:left-[12%] lg:top-0',
  },
  {
    n: '02',
    title: 'Planning',
    text: 'Defining the architecture.',
    tag: 'SEQ: 1024',
    icon: Compass,
    pos: 'lg:left-[48%] lg:top-0',
  },
  {
    n: '03',
    title: 'UI Design',
    text: 'Sculpting the interface.',
    tag: 'DPI: 300',
    icon: Palette,
    pos: 'lg:left-[66%] lg:top-[34%]',
  },
  {
    n: '04',
    title: 'Development',
    text: 'Forging the core.',
    tag: 'BUILD: SUCCESS',
    icon: Code2,
    pos: 'lg:left-[54%] lg:top-[66%]',
  },
  {
    n: '05',
    title: 'Testing',
    text: 'Stress-testing the limits.',
    tag: 'QA: 99.9%',
    icon: Bug,
    pos: 'lg:left-[22%] lg:top-[66%]',
  },
  {
    n: '06',
    title: 'Launch',
    text: 'Deploying for impact.',
    tag: 'STATUS: LIVE',
    icon: Rocket,
    pos: 'lg:left-0 lg:top-[34%]',
  },
];

// Tentacle paths (viewBox 1024x560), hub centre = (512,280)
const tentacles = [
  'M450 205 C 380 200, 430 130, 330 150',
  'M560 197 C 520 150, 600 180, 565 150',
  'M608 280 C 650 230, 640 320, 676 265',
  'M590 360 C 540 380, 520 440, 553 445',
  'M430 362 C 480 390, 510 450, 481 445',
  'M416 280 C 360 330, 330 220, 256 265',
];

const styles = `
@keyframes oct-draw { from { stroke-dashoffset: 100 } to { stroke-dashoffset: 0 } }
@keyframes oct-flow { to { stroke-dashoffset: -200 } }
@keyframes oct-sway { 0%,100% { transform: rotate(-1.2deg) } 50% { transform: rotate(1.2deg) } }
@keyframes oct-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes oct-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(163,230,53,.35) } 50% { box-shadow: 0 0 40px 10px rgba(163,230,53,.18) } }
@keyframes oct-spin { to { transform: rotate(360deg) } }
.oct-base { stroke-dasharray: 100; animation: oct-draw 1.6s ease-out both }
.oct-flow { stroke-dasharray: 6 14; animation: oct-flow 6s linear infinite }
.oct-arm { transform-origin: 512px 280px; animation: oct-sway 5s ease-in-out infinite }
.oct-card { animation: oct-float 5s ease-in-out infinite }
.oct-hub { animation: oct-pulse 3s ease-in-out infinite }
.oct-ring { animation: oct-spin 18s linear infinite }
@media (prefers-reduced-motion: reduce) {
  .oct-base,.oct-flow,.oct-arm,.oct-card,.oct-hub,.oct-ring { animation: none }
}
`;

const Process = () => {
  return (
    <section
      id="process"
      className="scroll-mt-20 bg-[linear-gradient(to_bottom,rgba(60,90,10,0.35),transparent)] px-4 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-medium leading-tight sm:text-5xl">
          A Kinetic Methodology
          <span className="block">
            From <span className="text-brand">Abstract Idea to Scalable</span>
          </span>
          <em className="block font-normal">Infrastructure</em>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-slate-300">
          Our process isn&apos;t a list. It&apos;s a high precision engineering
          cycle designed to accelerate your vision with surgical accuracy.
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl lg:h-[560px]">
        <style>{styles}</style>

        {/* Tentacles */}
        <svg
          viewBox="0 0 1024 560"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="oct-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a3e635" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {tentacles.map((d, i) => (
            <g
              key={d}
              className="oct-arm"
              style={{ animationDelay: `${i * -0.8}s` }}
            >
              <path
                d={d}
                pathLength={100}
                fill="none"
                stroke="url(#oct-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="oct-base"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
              <path
                d={d}
                fill="none"
                stroke="#d9f99d"
                strokeWidth="2"
                strokeLinecap="round"
                className="oct-flow"
                style={{ animationDelay: `${i * -1}s` }}
              />
            </g>
          ))}
        </svg>

        {/* Hub */}
        <div className="oct-hub absolute left-1/2 top-1/2 z-10 hidden h-48 w-48 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full border border-brand/20 bg-surface lg:flex">
          <Waypoints className="h-10 w-10 text-brand" />
          <span className="text-xs font-medium tracking-widest text-brand">
            PROCESS FLOW
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            SYS.INIT_00
          </span>
        </div>

        <div className="oct-ring pointer-events-none absolute left-1/2 top-1/2 hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand/30 lg:block" />

        <ol className="grid gap-4 sm:grid-cols-2 lg:block">
          {steps.map((s, i) => (
            <li
              key={s.n}
              style={{ animationDelay: `${i * -0.7}s` }}
              className={`oct-card relative z-5 rounded-xl border border-white/10 bg-linear-to-br from-brand/10 to-transparent p-5 lg:absolute lg:w-64 ${s.pos}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl text-brand">{s.n}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {s.tag}
                </span>
              </div>
              <h3 className="mt-2 text-lg">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{s.text}</p>
              <s.icon className="mx-auto mt-4 h-8 w-8 text-brand" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
