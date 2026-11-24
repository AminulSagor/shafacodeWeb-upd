import Link from 'next/link';
import { ArrowRight, Banknote } from 'lucide-react';

const PricingCta = () => {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-t border-brand/10 bg-gradient-to-b from-[#3c5a0a]/50 via-[#233210]/40 to-transparent px-4 py-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-slate-200">
          <Banknote className="h-3.5 w-3.5 text-brand" />
          Pricing
        </span>
        <h2 className="mt-6 text-4xl font-medium sm:text-5xl">
          Need a <em className="text-brand">Budget Idea</em> Before Starting?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-slate-300">
          Explore our starting packages for websites, apps, and complete
          digital product development. Final pricing depends on features,
          timeline, integrations, and support needs.
        </p>
        <Link
          href="/#contact"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90"
        >
          View Packages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default PricingCta;
