import AffiliateHero from '@/components/affiliate/affiliate-hero';
import AffiliateInfo from '@/components/affiliate/affiliate-info';

const AffiliatePage = () => {
  return (
    <div className="relative border-b border-b-slate-700 h-screen">
      {/* Blurred content */}

      <AffiliateHero />
      <AffiliateInfo />
    </div>
  );
};

export default AffiliatePage;
