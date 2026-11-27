import { Building2, Check, FileText } from 'lucide-react';
import { kickoffSteps } from '@/data/home';

const Visual = ({ i }: { i: number }) => {
  if (i === 0)
    return (
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-panel px-4 py-3">
        <Building2 className="h-5 w-5 text-brand" />
        <span className="h-2 w-40 rounded-full bg-white/20" />
      </div>
    );
  if (i === 1)
    return (
      <div className="flex items-center gap-2">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-brand/40 bg-black/40 text-brand">
              <Check className="h-4 w-4" />
            </span>
            <span className="h-px w-8 bg-white/20" />
          </span>
        ))}
        <span className="grid h-11 w-11 place-items-center rounded-full border border-brand bg-brand/10 text-brand shadow-[0_0_18px_-2px_var(--color-brand)]">
          <FileText className="h-4 w-4" />
        </span>
      </div>
    );
  return (
    <div className="flex gap-2 text-xs">
      <span className="rounded-full border border-white/20 px-3 py-1.5">
        Save Site
      </span>
      <span className="rounded-full border border-white/20 px-3 py-1.5">
        Preview
      </span>
      <span className="rounded-full border border-brand/60 bg-brand/10 px-3 py-1.5 text-brand">
        Go Live
      </span>
    </div>
  );
};

const Kickoff = () => {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-medium sm:text-5xl">
          From First Message to{' '}
          <em className="text-brand">Project Kickoff</em>
        </h2>
        <p className="mt-5 text-slate-300">
          Share your project idea, goals, timeline, and budget range. Our team
          will review it and guide you with the next steps.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
        {kickoffSteps.map((s, i) => (
          <div
            key={s.title}
            className="flex flex-col rounded-3xl border border-white/10 bg-panel/60 p-6 text-center"
          >
            <div className="grid h-40 place-items-center rounded-2xl bg-black/30">
              <Visual i={i} />
            </div>
            <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Kickoff;
