const BlogListSkeleton = () => {
  return (
    <section className="animate-pulse px-4 pb-24">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-72 rounded-2xl border border-white/10 bg-panel" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-xl border border-white/10 bg-panel"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogListSkeleton;
