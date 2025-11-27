import AffiliateHero from '@/components/affiliate/affiliate-hero';
import AffiliateInfo from '@/components/affiliate/affiliate-info';

const AffiliatePage = () => {
  return (
    <div className="relative border-b border-b-slate-700 h-screen">
      {/* Blurred content */}

      <AffiliateHero />
      <AffiliateInfo />

      {/* Overlay message */}
      {/* <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-black/60 backdrop-blur-md text-white px-8 py-6 rounded-xl text-center shadow-lg">
          <h2 className="text-2xl font-bold">🚧 Under Construction</h2>
          <p className="text-sm mt-2">
            This page is not completed yet. Please check back later.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default AffiliatePage;
