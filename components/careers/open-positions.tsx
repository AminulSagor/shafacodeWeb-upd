import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { openPositions } from '@/data/open-positions';
import { groupPositionsByDepartment } from '@/helper/group-positions-by-dept';

const OpenPositions = () => {
  const positions = groupPositionsByDepartment(openPositions);
  return (
    <section className="bg-slate-800 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100">
            Open Positions
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Explore our current job openings and find the role that fits you
            best.
          </p>
        </div>

        {/* Job Sections */}
        <div className="space-y-12">
          {positions.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-200 border-l-4 border-sky-400 pl-4">
                {section.department}
              </h3>

              <div className="space-y-4">
                {section.jobs.map((job, jdx) => (
                  <Link
                    className="block"
                    key={jdx}
                    href={`/careers/${job.slug}`}
                  >
                    <div className="bg-slate-900/40 border border-slate-700 hover:border-sky-400/40 rounded-xl p-6 transition cursor-pointer group">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-100">
                            {job.title}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">
                            {job.type} • {job.location}
                          </p>
                        </div>
                        <p className="inline-flex items-center text-sky-400 font-medium text-sm group-hover:underline">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenPositions;
