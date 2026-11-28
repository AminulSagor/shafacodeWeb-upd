import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogBySlug } from '@/actions/blogs/get-blog-by-slug';
import capitalizeWords from '@/helper/capitalized-words';

const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="px-4 pb-24 pt-44 text-center text-slate-300">
        Blog not found.
      </div>
    );
  }

  const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(110,170,10,0.35),transparent_70%)] px-4 pb-24 pt-40">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blogs"
          className="inline-flex items-center text-sm uppercase tracking-wider text-slate-300 hover:text-brand"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Link>

        <header className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-3 py-1 text-xs uppercase tracking-wider text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {capitalizeWords(blog.category)}
          </span>
          <h1 className="mt-5 text-3xl font-medium leading-tight sm:text-5xl">
            {blog.title}
          </h1>
          <p className="mt-4 text-sm text-slate-400">{formattedDate}</p>
          {blog.excerpt && (
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              {blog.excerpt}
            </p>
          )}
        </header>

        {blog.coverImage && (
          <div className="relative mt-10 h-72 overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_60px_-30px_var(--color-brand)] md:h-[460px]">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="prose prose-invert mt-12 max-w-none prose-headings:font-medium prose-a:text-brand prose-strong:text-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        <aside className="mt-16 rounded-2xl border border-brand/30 bg-panel p-6">
          <h2 className="text-xl font-medium">Need a precise estimate?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Let&apos;s discuss your project architecture and build a reliable
            roadmap.
          </p>
          <Link
            href="/#contact"
            className="mt-5 inline-block rounded-lg border border-brand px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand hover:text-black"
          >
            Free Consultation →
          </Link>
        </aside>
      </div>
    </article>
  );
};

export default BlogDetailsPage;
