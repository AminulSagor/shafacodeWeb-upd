import { getJobBySlug } from '@/actions/jobs/get-job-by-slug';
import capitalizeWords from '@/helper/capitalized-words';
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';
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
  return (
    <section className="bg-slate-900 min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back Button */}
        <Link
          href="/careers"
          className="inline-flex items-center text-slate-300 hover:text-sky-400 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Careers
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-100">
            {job?.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-sky-400" />
              {capitalizeWords(job?.department)}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock className="w-4 h-4 text-sky-400" />
              {job?.type}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4 text-sky-400" />
              {job?.location}
            </span>
          </div>
        </div>

        {/* Job Markdown */}
        <div className="prose prose-invert max-w-none text-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {job?.jobDescription}
          </ReactMarkdown>
        </div>

        {/* Apply Button */}
        <div className="pt-6">
          <Link
            href={'/careers/' + slug + '/apply'}
            className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-slate-900 font-semibold px-6 py-3 rounded-xl transition w-full sm:w-auto hover:cursor-pointer"
          >
            Apply for this role
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsPage;
