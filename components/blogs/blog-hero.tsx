import PageHero from '@/components/shared/page-hero';

const BlogHero = () => (
  <PageHero
    title={
      <>
        Insights for Building
        <em className="block text-brand">Better Digital Products</em>
      </>
    }
    description="Read practical guides on software development, UI/UX, app development, business automation, SaaS, and digital growth."
  />
);

export default BlogHero;
