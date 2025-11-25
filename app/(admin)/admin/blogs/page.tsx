import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const BlogsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Blogs</h2>
        <Button className="hover:cursor-pointer" asChild>
          <Link href={'/admin/blogs/create'}>Create Blog</Link>
        </Button>
      </div>
      {/* <ProjectsList projects={data} /> */}
    </div>
  );
};

export default BlogsPage;
