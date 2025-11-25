import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogBySlug } from '@/actions/blogs/get-blog-by-slug';
import { Badge } from '@/components/ui/badge';
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
      <div className="text-center py-20 text-slate-300">Blog not found.</div>
    );
  }

  const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="bg-slate-900 min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center text-slate-300 hover:text-sky-400 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-100">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-slate-400 text-sm items-center">
            <Badge variant="secondary">{capitalizeWords(blog.category)}</Badge>
            <span>{formattedDate}</span>
          </div>

          <p className="text-slate-300">{blog.excerpt}</p>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative w-full h-80 md:h-[500px] rounded-sm overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Blog Markdown */}
        <div className="prose prose-invert max-w-none text-slate-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsPage;
