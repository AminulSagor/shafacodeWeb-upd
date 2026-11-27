import { ArrowRight, Eye, Network, Ruler } from 'lucide-react';

const panel =
  'rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40 backdrop-blur-sm';

const WhyChooseUs = () => {
  return (
    <section
      id="why-us"
      className="scroll-mt-20 bg-[radial-gradient(ellipse_70%_45%_at_50%_30%,rgba(130,190,20,0.55),transparent_75%)] px-4 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-medium sm:text-5xl">
          Why Businesses Choose{' '}
          <em className="text-brand/80">ShafaCode</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-slate-200">
          Engineered for performance. Designed for humans. We build software
          solutions that power the modern enterprise.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-[1fr_1.4fr]">
        <div className={`${panel} flex flex-col p-8 md:row-span-2`}>
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-black text-brand">
            <Eye className="h-6 w-6" />
          </span>
          <h3 className="mt-8 text-2xl font-semibold">Transparent Dev</h3>
          <p className="mt-4 flex-1 leading-relaxed text-slate-300">
            Every milestone, decision, and update stays clear so you always
            know what is happening. Total visibility from sprint zero to
            deployment.
          </p>
          <p className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-brand/40">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            Full Visibility
          </p>
        </div>

        {[
          {
            icon: Ruler,
            title: 'Product Minded',
            text: 'We do not just write code. We think about users, business goals, usability, and long-term growth. Strategic engineering for real impact.',
          },
          {
            icon: Network,
            title: 'Scalable Engineering',
            text: 'We build with modern technologies, clean structure, and future expansion in mind. Architecture designed to evolve with your business.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className={`${panel} flex items-center gap-6 p-8`}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/40 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
