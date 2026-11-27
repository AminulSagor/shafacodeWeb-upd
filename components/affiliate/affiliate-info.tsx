import { Banknote, MessagesSquare, Rocket, UserPlus } from 'lucide-react';
import AffiliateLeadForm from './affiliate-lead-form';
import BriefSummary from './brief-summary';
import VideoPlayer from './video-player';

const steps = [
  {
    icon: UserPlus,
    title: 'Step 1: Refer',
    text: 'Share a potential project or ask the client to mention you.',
  },
  {
    icon: MessagesSquare,
    title: 'Step 2: Discuss',
    text: 'Our team understands the requirements, budget, and timeline.',
  },
  {
    icon: Rocket,
    title: 'Step 3: Start',
    text: 'Once confirmed and started, your referral is recorded.',
  },
  {
    icon: Banknote,
    title: 'Step 4: Earn',
    text: 'You earn 4–6% commission based on the project value.',
  },
];

const AffiliateInfo = () => {
  return (
    <>
      <section className="bg-panel/40 px-4 py-20">
        <h2 className="text-center text-4xl font-medium">How It Works</h2>
        <ol className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-surface/60 p-6 text-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-brand/40 text-brand">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-4xl items-center gap-8 rounded-2xl border border-white/10 bg-panel/50 p-8 shadow-[0_0_60px_-30px_var(--color-brand)] md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-4xl font-medium leading-tight">
              Transparent Earnings
            </h2>
            <p className="mt-4 text-sm text-slate-300">
              Our commission structure is straightforward, rewarding you fairly
              for connecting us with quality projects.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-surface p-6 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Example Scenario
            </p>
            <p className="mt-2 border-b border-white/10 pb-4 text-xl">
              Project Value: <span className="text-brand">৳200,000</span>
            </p>
            <p className="mt-4 rounded-lg bg-panel px-3 py-3 text-sm">
              Estimated Commission{' '}
              <span className="text-xl text-brand">৳8K - ৳12K</span>
            </p>
          </div>
        </div>
      </section>

      <section id="join" className="scroll-mt-24 px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-[2] flex-col gap-8">
              <VideoPlayer />
              <BriefSummary />
            </div>
            <div className="flex-1">
              <AffiliateLeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AffiliateInfo;
