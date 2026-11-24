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
        {/* Hub */}
        <div className="absolute left-1/2 top-1/2 z-10 hidden h-48 w-48 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full border border-brand/20 bg-surface lg:flex">
          <Waypoints className="h-10 w-10 text-brand" />
          <span className="text-xs font-medium tracking-widest text-brand">
            PROCESS FLOW
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            SYS.INIT_00
          </span>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:block">
          {steps.map((s) => (
            <li
              key={s.n}
              className={`relative rounded-xl border border-white/10 bg-gradient-to-br from-brand/10 to-transparent p-5 lg:absolute lg:w-64 ${s.pos}`}
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
