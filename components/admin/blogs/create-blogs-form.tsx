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

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/shared/image-uploader';
import { supabase } from '@/lib/supabase-client';
import createBlog from '@/actions/blogs/create-blog';

// ----------------- ZOD SCHEMA -----------------
export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  coverImage: z.any().nullable(), // File will be stored
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

// ----------------- COMPONENT -----------------
const CreateBlogsForm = () => {
  const router = useRouter();
  const [markdownPreview, setMarkdownPreview] = useState('');

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      excerpt: '',
      content: '',
      coverImage: '',
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    let uploadUrl = null;
    if (values.coverImage) {
      const file = values.coverImage;
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shafacode')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('shafacode')
        .getPublicUrl(fileName);
      uploadUrl = publicUrlData?.publicUrl;
    }
    // create final payload
    const payload = {
      title: values.title,
      slug: values.slug,
      category: values.category,
      coverImage: uploadUrl,
      excerpt: values.excerpt,
      content: values.content,
    };

    const blog = await createBlog(payload);

    if (blog.success) {
      toast.success('Blog created successfully');
      router.push(`/admin/blogs/`);
    } else {
      toast.error('Try again later');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blog</CardTitle>
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
                  <FormLabel>Blog Title</FormLabel>
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
                    <Input
                      placeholder="e.g. introduction-to-react"
                      {...field}
                    />
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

            {/* image upload */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
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

            {/* Markdown Editor + Preview */}
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
                          placeholder="Write your blog in markdown..."
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setMarkdownPreview(e.target.value);
                          }}
                          className="h-96"
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
              Publish Blog
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateBlogsForm;
