import Image from 'next/image';
import { blogs } from '@/data/blogs';
import Link from 'next/link';
import { getBlogs } from '@/actions/blogs/get-blogs';

const BlogList = async () => {
  // const featured = blogs.filter((b) => b.featured);
  // const regular = blogs.filter((b) => !b.featured);

  const blogs = await getBlogs();

  return (
    <section className="py-14 md:py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 text-center mb-12">
          Latest From <span className="text-sky-600">Our Blog</span>
        </h1>

        {/* Featured Section */}
        {/* {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Featured
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              {featured.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <Link
                      href={'/blogs/' + blog.id}
                      className="text-2xl font-semibold text-slate-900 hover:text-sky-600 transition-all duration-200 ease-in-out hover:underline"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {blog.short}
                    </p>

                    <div className="text-sky-600 text-sm font-medium">
                      {blog.date}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* All Blogs Section */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            All Blogs
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {blogs.map((blog) => {
              return (
                <div
                  key={blog.id}
                  className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 space-y-3">
                    <Link
                      href={'/blogs/' + blog.slug}
                      className="text-lg font-semibold text-slate-900 hover:text-sky-600 transition-all duration-200 ease-in-out hover:underline line-clamp-1"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-slate-600 text-sm line-clamp-1">
                      {blog.excerpt}
                    </p>

                    <div className="text-sky-600 text-xs font-medium">
                      {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogList;
