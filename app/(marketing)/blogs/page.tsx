import BlogHero from '@/components/blogs/blog-hero';
import BlogList from '@/components/blogs/blog-list';
import BlogListSkeleton from '@/components/blogs/blogs-skeleton';
import { Suspense } from 'react';

const BlogsPage = () => {
  return (
    <div>
      <BlogHero />
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  );
};

export default BlogsPage;
