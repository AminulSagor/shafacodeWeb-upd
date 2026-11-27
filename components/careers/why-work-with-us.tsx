import {
  Briefcase,
  Code2,
  GraduationCap,
  Globe,
  Lightbulb,
  Users,
} from 'lucide-react';

const items = [
  {
    title: 'Growth & Learning',
    desc: 'Continuous opportunities to expand your skill set and tackle complex engineering challenges through structured learning paths.',
    icon: GraduationCap,
    span: '',
  },
  {
    title: 'Collaborative Culture',
    desc: 'Work alongside passionate professionals in an environment that values open communication and shared success.',
    icon: Users,
    span: 'lg:col-span-2',
  },
  {
    title: 'Real Client Projects',
    desc: "Engage directly with impactful projects that deliver tangible value. Your code won't just sit in a repo; it will power businesses.",
    icon: Briefcase,
    span: 'lg:col-span-2',
  },
  {
    title: 'Modern Tech Stack',
    desc: 'Utilize cutting-edge tools, frameworks, and methodologies to build robust and scalable solutions.',
    icon: Code2,
    span: '',
  },
  {
    title: 'Remote-Friendly Workflow',
    desc: 'Flexible working arrangements designed to support a healthy work-life balance. Work from where you are most inspired.',
    icon: Globe,
    span: '',
  },
  {
    title: 'Mentorship & Feedback',
    desc: 'Structured guidance from industry veterans to accelerate your professional development journey.',
    icon: Lightbulb,
    span: 'lg:col-span-2',
  },
];

const WhyWorkWithUs = () => {
  return (
    <section id="culture" className="scroll-mt-20 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-md text-4xl font-medium leading-tight">
            Elevate your craft in an environment built for{' '}
            <em className="text-brand">excellence.</em>
          </h2>
          <p className="border-l-2 border-brand pl-4 text-sm text-slate-300">
            Why Work With Us?
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map(({ title, desc, icon: Icon, span }) => (
            <div
              key={title}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-7 transition-colors hover:border-brand/30 ${span}`}
            >
              <Icon className="h-6 w-6 text-brand" />
              <h3 className="mt-6 text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;
