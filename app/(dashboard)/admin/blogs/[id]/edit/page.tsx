import { getBlogById } from '@/actions/blogs/get-blog-by-id';
import EditBlogsForm from '@/components/admin/blogs/edit-blogs-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const EditBlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const blog = await getBlogById(id);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Edit Blog</h2>
        <Button asChild>
          <Link href="/admin/blogs">Go Back</Link>
        </Button>
      </div>
      <EditBlogsForm blog={blog} />
    </div>
  );
};

export default EditBlogPage;
