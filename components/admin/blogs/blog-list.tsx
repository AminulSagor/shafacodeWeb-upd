'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { firebaseClient } from '@/db/firebase-client';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export interface Blog {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  slug: string;
}

export interface BlogListProps {
  blogs: Blog[];
}

const BlogList = ({ blogs }: BlogListProps) => {
  const router = useRouter();

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(firebaseClient, 'blogs', id));
      toast.error('Blog deleted successfully.');
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Excerpt</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium min-w-[400px]">
                {blog.title}
              </TableCell>
              <TableCell>{blog.category}</TableCell>
              <TableCell>
                {blog.excerpt.split(' ').slice(0, 6).join(' ')}
                {blog.excerpt.split(' ').length > 6 ? '...' : ''}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/blogs/${blog.slug}`)}
                >
                  <EyeIcon />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                >
                  <EditIcon />
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(blog.id)}
                >
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogList;
