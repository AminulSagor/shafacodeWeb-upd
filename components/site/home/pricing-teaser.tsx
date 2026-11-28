import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ScopeEstimator } from '@/components/site/interactive/scope-estimator';

/** Figma: Pricing teaser 94:18903 */
export function PricingTeaser() {
  return (
    <section aria-labelledby="pricing-title" className="section-y">
      <div className="container-page">
        <div className="grid items-center gap-10 border-t border-line-subtle pt-10 xl:grid-cols-[560px_600px] xl:justify-between xl:pt-12">
          <div className="flex flex-col items-start">
            <Eyebrow>Packages</Eyebrow>
            <h2 id="pricing-title" className="mt-6 type-h2 text-fg">
              Get a budget idea in <Accent>ten seconds</Accent>
            </h2>
            <p className="mt-6 type-body-lg text-fg-muted">
              Explore starting packages for websites, apps and complete digital products. Final pricing depends on
              features, timeline, integrations and support needs.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/packages">
                  View packages <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/contact?type=quote">Get a custom quote</Link>
              </Button>
            </div>
          </div>
          <ScopeEstimator />
        </div>
      </div>
    </section>
  );
}
