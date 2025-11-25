import CreateBlogsForm from '@/components/admin/blogs/create-blogs-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const CreateBlogPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Create Blog</h2>
        <Button asChild>
          <Link href="/admin/blogs">Go Back</Link>
        </Button>
      </div>
      <CreateBlogsForm />
    </div>
  );
};

export default CreateBlogPage;
