export const dynamic = 'force-dynamic';

import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { groupPositionsByDepartment } from '@/helper/group-positions-by-dept';
import { getJobs } from '@/actions/jobs/get-jobs';
import capitalizeWords from '@/helper/capitalized-words';

const hiringSteps = [
  { title: 'Apply online', text: 'Submit your details through our streamlined portal.' },
  { title: 'Portfolio/CV review', text: 'Our team carefully evaluates your past work and experience.' },
  { title: 'Short interview', text: 'A brief conversation to align on goals and cultural fit.' },
  { title: 'Task or skill test', text: 'A practical assessment of your technical capabilities.' },
  { title: 'Final selection', text: 'Comprehensive review and offer extension.' },
  { title: 'Onboarding', text: "Welcome to the team. Let's build something great." },
];

const OpenPositions = async () => {
  const jobs = await getJobs();
  const positions = groupPositionsByDepartment(jobs);

  return (
    <>
      <section id="open-positions" className="scroll-mt-20 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="border-b border-white/10 pb-6 text-4xl font-medium">
            Open <span className="text-brand">Positions</span>
          </h2>

          {positions.length === 0 && (
            <p className="py-10 text-slate-400">
              No open positions right now. Send us an open application below.
            </p>
          )}

          <div className="mt-8 space-y-10">
            {positions.map((section, idx) => (
              <div key={idx}>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-brand">
                  {capitalizeWords(section.department)}
                </h3>
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {section.jobs.map((job) => (
                    <li key={job.slug}>
                      <Link
                        href={`/careers/${job.slug}`}
                        className="group flex items-center justify-between gap-4 py-6"
                      >
                        <div>
                          <h4 className="text-lg group-hover:text-brand">
                            {job.title}
                          </h4>
                          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                            {section.department} · {job.location} · {job.type}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d100e] px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-medium">Our Hiring Process</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
            A systematic, transparent journey designed to find the best fit for
            both of us.
          </p>
        </div>
        <ol className="relative mx-auto mt-14 max-w-3xl space-y-8 border-l border-brand/30 pl-8">
          {hiringSteps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border border-brand bg-surface" />
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-medium text-white/10">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-panel/50 px-8 py-14 text-center">
          <Mail className="mx-auto h-7 w-7 text-brand" />
          <h2 className="mt-5 text-4xl font-medium">
            Don&apos;t See the Right Role?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-300">
            We&apos;re always looking for exceptional talent. Drop us your
            resume and let&apos;s start a conversation.
          </p>
          <a
            href="mailto:aminulislamsagor@shafacode.com?subject=Open%20Application"
            className="mt-8 inline-block rounded-full border border-brand px-7 py-3 text-xs font-semibold uppercase tracking-wider text-brand hover:bg-brand hover:text-black"
          >
            Submit Open Application
          </a>
        </div>
      </section>
    </>
  );
};

export default OpenPositions;
