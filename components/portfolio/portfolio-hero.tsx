import PageHero from '@/components/shared/page-hero';

const PortfolioHero = ({
  delivered,
  onprogress,
}: {
  delivered: number;
  onprogress: number;
}) => {
  const stats = [
    { value: delivered, label: 'Completed Projects', accent: true },
    { value: onprogress, label: 'Ongoing Projects' },
    { value: '3+', label: 'Years Experience' },
  ];

  return (
    <PageHero
      title={
        <>
          Our Work in <span className="text-brand">Design, Development</span>,
          and Digital Products
        </>
      }
      description="Explore selected projects we have designed and developed across web applications, mobile apps, dashboards, automation systems, UI/UX, and backend platforms."
    >
      <dl className="mx-auto mt-6 grid max-w-3xl grid-cols-1 divide-white/10 rounded-2xl border border-white/10 bg-panel/50 py-6 sm:grid-cols-3 sm:divide-x">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3 text-center">
            <dd
              className={`text-5xl font-medium ${s.accent ? 'text-brand' : ''}`}
            >
              {s.value}
            </dd>
            <dt className="mt-2 text-xs uppercase tracking-widest text-slate-300">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </PageHero>
  );
};

export default PortfolioHero;
