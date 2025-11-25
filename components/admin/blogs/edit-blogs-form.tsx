'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/shared/image-uploader';
import { supabase } from '@/lib/supabase-client';

import { blogSchema, BlogFormValues } from './create-blogs-form';
import { updateBlog } from '@/actions/blogs/update-bolg-by-id';

interface EditBlogsFormProps {
  blog: any; // incoming blog from server
}

const EditBlogsForm = ({ blog }: EditBlogsFormProps) => {
  const router = useRouter();
  const [markdownPreview, setMarkdownPreview] = useState(blog.content);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: '',
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    let finalImage = blog.coverImage;

    // If user selects a new image → upload to supabase
    if (values.coverImage && values.coverImage instanceof File) {
      const file = values.coverImage;
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('shafacode')
        .upload(fileName, file, { upsert: false });

      if (uploadError) {
        console.error(uploadError);
        toast.error('Image upload failed!');
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('shafacode')
        .getPublicUrl(fileName);

      finalImage = publicUrlData.publicUrl;
    }

    // Create final payload
    const payload = {
      title: values.title,
      slug: values.slug,
      category: values.category,
      excerpt: values.excerpt,
      content: values.content,
      coverImage: finalImage,
      createdAt: blog.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const result = await updateBlog(blog.id, payload);
    if (result.success) {
      toast.success('Blog updated successfully');
      router.push('/admin/blogs');
    } else {
      toast.error('Failed to update blog');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Blog</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. my-blog-title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Existing Image Preview */}
            {blog.coverImage && (
              <div>
                <p className="text-sm mb-2 font-medium">Current Cover Image:</p>
                <img
                  src={blog.coverImage}
                  alt="cover"
                  className="max-w-md  object-cover rounded border"
                />
              </div>
            )}

            {/* New Image Upload */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Change Cover Image</FormLabel>
                    <ImageUploader
                      value={form.watch('coverImage')}
                      onChange={(file) => form.setValue('coverImage', file)}
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Excerpt */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short summary of the blog..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Markdown Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editor */}
              <div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-96"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setMarkdownPreview(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 overflow-auto h-96 prose mt-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownPreview}
                </ReactMarkdown>
              </div>
            </div>

            <Button type="submit" className="mt-4">
              Update Blog
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditBlogsForm;
