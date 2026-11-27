import { Quote } from 'lucide-react';
import { testimonials, videoStories } from '@/data/home';

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-b from-transparent via-[#1b2a0c]/60 to-transparent px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-medium sm:text-5xl">
          What Clients Say
          <em className="block text-brand">About Working With Us</em>
        </h2>
        <p className="mt-6 text-slate-300">
          Real feedback builds trust. We deliver engineering excellence that
          speaks for itself.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-6">
        {testimonials.map((t, i) => (
          <figure
            key={t.name}
            className={`flex flex-col rounded-2xl border border-white/10 bg-[#0f1110] p-8 md:col-span-3 ${i === 2 ? 'md:col-span-4 md:col-start-2' : ''}`}
          >
            <Quote className="h-7 w-7 fill-brand/70 text-brand/70" />
            <blockquote className="mt-4 flex-1 text-lg font-medium leading-snug">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-brand/60 bg-panel text-xs font-semibold text-brand">
                {initials(t.name)}
              </span>
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block text-xs text-slate-400">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-28 max-w-3xl text-center">
        <h2 className="text-4xl font-medium sm:text-5xl">
          Video Success <span className="text-brand">Stories</span>
        </h2>
        <p className="mt-4 text-slate-300">
          See the impact of ShafaCode engineering in action.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
        {videoStories.map((v) => (
          <article
            key={v.name}
            className="overflow-hidden rounded-2xl border border-white/10 bg-panel"
          >
            <div className="grid h-52 place-items-center bg-black/60">
              <span
                className="grid h-12 w-12 place-items-center rounded-full bg-brand text-black shadow-[0_0_24px_var(--color-brand)]"
                aria-label={`Video from ${v.name}`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-semibold">{v.name}</h3>
              <p className="mt-2 text-sm text-slate-300">
                &ldquo;{v.quote}&rdquo;
              </p>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-brand">
                {v.role}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
