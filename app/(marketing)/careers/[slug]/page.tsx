import { getJobBySlug } from '@/actions/jobs/get-job-by-slug';
import capitalizeWords from '@/helper/capitalized-words';
import { ArrowLeft, ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  const applyHref = `/careers/${slug}/apply`;

  const chips = [
    { icon: Clock, text: job?.type },
    { icon: MapPin, text: job?.location },
    { icon: Briefcase, text: capitalizeWords(job?.department) },
  ];

  return (
    <section className="bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(110,170,10,0.35),transparent_70%)] px-4 pb-24 pt-40">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/careers"
          className="inline-flex items-center text-sm uppercase tracking-wider text-slate-300 hover:text-brand"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers
        </Link>

        <h1 className="mt-8 max-w-3xl text-4xl font-medium leading-tight sm:text-6xl">
          {job?.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-3">
          {chips.map(({ icon: Icon, text }, i) =>
            text ? (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-panel/60 px-4 py-2 text-sm"
              >
                <Icon className="h-4 w-4 text-brand" />
                {text}
              </span>
            ) : null
          )}
        </div>

        <Link
          href={applyHref}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-brand"
        >
          Apply for this role <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="prose prose-invert max-w-none rounded-2xl border border-white/5 bg-panel/60 p-8 prose-headings:font-medium prose-a:text-brand prose-strong:text-white md:p-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {job?.jobDescription}
            </ReactMarkdown>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-panel/60 p-6">
              <h2 className="text-2xl font-medium">Ready to build?</h2>
              <p className="mt-3 text-sm text-slate-300">
                Join our team of rigorous engineers pushing the boundaries of
                the web.
              </p>
              <Link
                href={applyHref}
                className="mt-6 block rounded-lg bg-brand py-3 text-center text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90"
              >
                Apply Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsPage;
