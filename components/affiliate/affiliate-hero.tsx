import Link from 'next/link';
import PageHero from '@/components/shared/page-hero';

const AffiliateHero = () => (
  <PageHero
    title={
      <>
        Become a <em className="text-brand/90">ShafaCode</em> Partner and Earn
        From Referrals
      </>
    }
    description="Refer software, website, app, or IoT projects to ShafaCode and earn commission when the project successfully starts."
  >
    <Link
      href="#join"
      className="inline-block rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90"
    >
      Join as a Partner
    </Link>
  </PageHero>
);

export default AffiliateHero;
