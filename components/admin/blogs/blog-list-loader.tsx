import BlogList from './blog-list';
import { getBlogs } from '@/actions/blogs/get-blogs';

const BlogListLoader = async () => {
  const blogs = await getBlogs();
  return <BlogList blogs={blogs} />;
};

export default BlogListLoader;
