import { SearchCheck } from 'lucide-react';

const bars = [30, 45, 58, 52, 100, 72, 80];
const barShade = [
  'bg-lime-900',
  'bg-lime-700',
  'bg-lime-600',
  'bg-lime-600',
  'bg-brand',
  'bg-lime-500',
  'bg-lime-500',
];

const card =
  'rounded-2xl border border-white/10 bg-panel p-8 transition-colors hover:border-brand/30';

const ValueProps = () => {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-medium leading-tight sm:text-5xl">
          Get your Software
          <em className="block font-normal text-brand/90">
            Without the Guesswork
          </em>
        </h2>
        <p className="mt-6 text-slate-300">
          Many businesses struggle with unclear timelines, poor communication,
          weak UI/UX, and development teams that disappear after delivery.
          ShafaCode solves this by combining product planning, transparent
          development, and long term technical support.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
        <div className={`${card} flex flex-col md:row-span-2`}>
          <div className="grid flex-1 place-items-center py-8">
            <div className="grid h-60 w-60 place-items-center rounded-full border border-brand/10">
              <div className="grid h-40 w-40 place-items-center rounded-full border border-brand/30 bg-[radial-gradient(circle,rgba(170,242,0,0.25),transparent_70%)]">
                <SearchCheck className="h-14 w-14 text-brand" />
              </div>
            </div>
          </div>
          <h3 className="text-xl">Intelligent Research</h3>
          <p className="mt-2 text-slate-300">
            We define the scope, features, timeline, and technical direction
            before development starts.
          </p>
        </div>

        <div className={`${card} flex flex-col`}>
          <div className="flex h-36 items-end gap-2 border-b border-white/10 px-4 pb-1">
            {bars.map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-t-sm ${barShade[i]}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <h3 className="mt-6 text-lg">Transparent Execution</h3>
          <p className="mt-2 text-sm text-slate-300">
            You stay updated through every milestone, decision, and delivery
            phase.
          </p>
        </div>

        <div className={`${card} flex flex-col`}>
          <div className="h-36 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
            <svg
              viewBox="0 0 280 140"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6a9a0a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6a9a0a" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M0 125 C30 105 55 105 80 118 C105 128 115 70 150 62 C185 55 210 40 235 18 L235 140 L0 140 Z"
                fill="url(#growth)"
              />
              <path
                d="M0 125 C30 105 55 105 80 118 C105 128 115 70 150 62 C185 55 210 40 235 18"
                fill="none"
                stroke="#d9e8b0"
                strokeWidth="2"
              />
              <circle cx="235" cy="18" r="6" fill="#fff" />
            </svg>
          </div>
          <h3 className="mt-6 text-lg">Scalable Delivery</h3>
          <p className="mt-2 text-sm text-slate-300">
            We build products that can grow with your users, operations, and
            business goals.
          </p>
        </div>

        <div
          className={`${card} grid items-center gap-6 sm:grid-cols-2 md:col-span-2`}
        >
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <div className="mb-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/20" />
              ))}
            </div>
            <div className="grid h-24 place-items-center">
              <span className="h-14 w-14 rounded-full border-4 border-brand" />
            </div>
          </div>
          <div>
            <h3 className="text-lg">Adaptive User Experience</h3>
            <p className="mt-2 text-sm text-slate-300">
              We create interfaces that feel simple for users and powerful
              enough for growing business needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
