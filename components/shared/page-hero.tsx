import type { ReactNode } from 'react';

type Props = {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Shared dark hero used by inner marketing pages (green glow, centered). */
const PageHero = ({ title, description, children, className = '' }: Props) => (
  <section
    className={`relative bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(110,170,10,0.4),transparent_70%)] px-4 pb-16 pt-40 text-center ${className}`}
  >
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-medium leading-tight sm:text-5xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          {description}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);

export default PageHero;
