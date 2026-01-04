import { ArrowLeft } from "lucide-react";

const JobDetailsLoading = () => {
  return (
    <section className="bg-slate-900 min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-10 animate-pulse">
        {/* Back Button */}
        <div className="inline-flex items-center text-slate-500">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <div className="h-4 w-32 bg-slate-700 rounded" />
        </div>

        {/* Header */}
        <div className="space-y-4">
          {/* Title */}
          <div className="h-10 w-3/4 bg-slate-700 rounded-lg" />

          {/* Meta */}
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-28 bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-slate-700 rounded" />
            <div className="h-4 w-32 bg-slate-700 rounded" />
          </div>
        </div>

        {/* Markdown Content */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-slate-700 rounded" />
          ))}

          <div className="h-4 w-5/6 bg-slate-700 rounded" />
          <div className="h-4 w-4/6 bg-slate-700 rounded" />
        </div>

        {/* Apply Button */}
        <div className="pt-6">
          <div className="h-12 w-full sm:w-56 bg-slate-700 rounded-xl" />
        </div>
      </div>
    </section>
  );
};

export default JobDetailsLoading;
