import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getBlogs } from '@/actions/blogs/get-blogs';
import capitalizeWords from '@/helper/capitalized-words';

const formatDate = (value: unknown) =>
  new Date(value as string).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const BlogList = async () => {
  const blogs = await getBlogs();
  const [featured, ...rest] = blogs;

  if (!featured) {
    return (
      <p className="px-4 py-20 text-center text-slate-400">
        No articles yet. Check back soon.
      </p>
    );
  }

  return (
    <section className="px-4 pb-24">
      <div className="mx-auto max-w-6xl">
        <article className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#0f1110] md:grid-cols-2">
          <div className="relative min-h-64">
            {featured.coverImage && (
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <p className="text-xs uppercase tracking-wider text-brand">
              {capitalizeWords(featured.category)}
              <span className="ml-3 normal-case text-slate-400">
                {formatDate(featured.updatedAt)}
              </span>
            </p>
            <h2 className="mt-3 text-3xl font-medium leading-tight md:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-slate-300">
              {featured.excerpt}
            </p>
            <Link
              href={`/blogs/${featured.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              Read Article <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>

        {rest.length > 0 && (
          <>
            <h2 className="mb-8 mt-20 text-2xl font-medium">
              Latest Technical Insights
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f1110] transition-colors hover:border-brand/40"
                >
                  <div className="relative h-44 bg-panel">
                    {blog.coverImage && (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-brand">
                      {capitalizeWords(blog.category)}
                      <span className="ml-2 text-slate-400">
                        • {formatDate(blog.updatedAt)}
                      </span>
                    </p>
                    <h3 className="mt-3 line-clamp-2 text-lg font-medium">
                      {blog.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-400">
                      {blog.excerpt}
                    </p>
                    <span className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-medium">
                      Read full guide
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogList;
