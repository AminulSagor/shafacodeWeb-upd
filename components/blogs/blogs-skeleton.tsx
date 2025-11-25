import React from 'react';

const BlogListSkeleton = () => {
  return (
    <section className="py-14 md:py-20 bg-slate-100 animate-pulse">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex justify-center ">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center mb-12">
            Latest From <span className="text-sky-600">Our Blog</span>
          </h1>
        </div>

        {/* All Blogs Skeleton */}
        <h2 className="text-xl font-semibold text-slate-800 mb-6">All Blogs</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-md shadow-md overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="w-full h-48 bg-slate-300"></div>

              <div className="p-5 space-y-3">
                {/* Title */}
                <div className="h-5 w-40 bg-slate-300 rounded"></div>

                {/* Excerpt */}
                <div className="h-4 w-56 bg-slate-200 rounded"></div>

                {/* Date */}
                <div className="h-3 w-24 bg-slate-300 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogListSkeleton;
