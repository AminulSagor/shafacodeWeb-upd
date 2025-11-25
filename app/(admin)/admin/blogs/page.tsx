import BlogList from '@/components/admin/blogs/blog-list';
import BlogListLoader from '@/components/admin/blogs/blog-list-loader';
import LoadingTable from '@/components/shared/loading-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { Suspense } from 'react';

const BlogsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Blogs</h2>
        <Button className="hover:cursor-pointer" asChild>
          <Link href={'/admin/blogs/create'}>Create Blog</Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <>
            <LoadingTable />
            <LoadingTable />
          </>
        }
      >
        <BlogListLoader />
      </Suspense>
    </div>
  );
};

export default BlogsPage;
