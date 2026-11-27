import {
  Atom,
  Cpu,
  Database,
  Flame,
  Flower2,
  Globe,
  Hexagon,
  Layers,
  Leaf,
  MonitorSmartphone,
  Radio,
  Server,
  Settings2,
  Smartphone,
  Triangle,
  Type,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

type Tech = { name: string; icon: LucideIcon };

const group = 'rounded-2xl border border-white/10 bg-black/20 p-4';
const groupTitle =
  'flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-300';

const TechTile = ({ name, icon: Icon }: Tech) => (
  <li className="flex min-h-24 flex-col justify-between rounded-xl border border-brand/30 bg-gradient-to-b from-[#8cb82e] to-[#3b5212] p-4">
    <Icon className="h-6 w-6 text-white" />
    <span className="mt-4 text-xs tracking-wide text-white">{name}</span>
  </li>
);

const TechGrid = ({ items, cols }: { items: Tech[]; cols: string }) => (
  <ul className={`mt-4 grid gap-3 ${cols}`}>
    {items.map((t) => (
      <TechTile key={t.name} {...t} />
    ))}
  </ul>
);

const frontend: Tech[] = [
  { name: 'React', icon: Atom },
  { name: 'Next.js', icon: Triangle },
  { name: 'TypeScript', icon: Type },
  { name: 'Flutter', icon: Smartphone },
];
const web: Tech[] = [{ name: 'Wordpress', icon: Globe }];
const backend: Tech[] = [
  { name: 'Node.js', icon: Hexagon },
  { name: 'Laravel', icon: Layers },
  { name: 'REST API', icon: Settings2 },
  { name: 'Firebase', icon: Flame },
];
const databases: Tech[] = [
  { name: 'MongoDB', icon: Leaf },
  { name: 'Postgre SQL', icon: Database },
];
const hardware: Tech[] = [
  { name: 'ESP32', icon: Cpu },
  { name: 'Raspberry Pi', icon: Flower2 },
  { name: 'MQTT', icon: Wifi },
  { name: 'Sensor Integration', icon: Radio },
];

const TechStack = () => {
  return (
    <section id="technologies" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Engineering Ecosystem
        </span>
        <h2 className="mt-5 text-4xl font-medium sm:text-5xl">
          <em className="text-brand">Technologies</em> We Work With
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-slate-300">
          We choose technologies based on your product goals, performance
          needs, budget, and long term scalability.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
        <div className={group}>
          <h3 className={groupTitle}>
            <MonitorSmartphone className="h-3.5 w-3.5 text-brand" />
            Frontend &amp; Mobile
          </h3>
          <TechGrid items={frontend} cols="grid-cols-2" />
          <h3 className={`${groupTitle} mt-8`}>
            <Globe className="h-3.5 w-3.5 text-brand" />
            Web Platforms
          </h3>
          <TechGrid items={web} cols="grid-cols-1" />
        </div>

        <div className={group}>
          <h3 className={groupTitle}>
            <Server className="h-3.5 w-3.5 text-brand" />
            Backend &amp; Infrastructure
          </h3>
          <TechGrid items={backend} cols="grid-cols-2" />
          <h3 className="mt-8 border-t border-white/10 pt-4 text-xs text-slate-300">
            Databases
          </h3>
          <TechGrid items={databases} cols="grid-cols-2" />
        </div>

        <div className={`${group} md:col-span-2`}>
          <h3 className={groupTitle}>
            <Cpu className="h-3.5 w-3.5 text-brand" />
            Hardware &amp; IoT Ecosystem
          </h3>
          <TechGrid items={hardware} cols="grid-cols-2 sm:grid-cols-4" />
        </div>
      </div>
    </section>
  );
};

export default TechStack;
