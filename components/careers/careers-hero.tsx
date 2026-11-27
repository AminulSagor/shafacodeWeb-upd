import Link from 'next/link';
import PageHero from '@/components/shared/page-hero';

const CareerHero = () => (
  <PageHero
    title={
      <>
        Build Your <em className="text-brand/90">Future</em> With ShafaCode.
      </>
    }
    description="Join a growing team of designers, developers, and innovators working on real products for real businesses."
  >
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href="#open-positions"
        className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90"
      >
        View Open Positions
      </Link>
      <Link
        href="#culture"
        className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-white/5"
      >
        Discover Our Culture
      </Link>
    </div>
  </PageHero>
);

export default CareerHero;
