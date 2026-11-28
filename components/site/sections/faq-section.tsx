import Link from 'next/link';
import { ArrowRight, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { JsonLd } from '@/components/site/json-ld';
import { faqLd } from '@/lib/structured-data';
import type { Faq } from '@/content/faq';

type FaqSectionProps = {
  items: readonly Faq[];
  title: React.ReactNode;
  eyebrow?: string;
  intro?: string;
  id?: string;
};

/**
 * Questions and answers, all visible (nothing behind a click), plus FAQPage
 * JSON-LD from the same data. Figma: FAQ Section 19:2879
 */
export function FaqSection({
  items,
  title,
  eyebrow = 'FAQ',
  intro = "Can't find your answer? Talk to us directly. We usually reply within 12 hours.",
  id = 'faq',
}: FaqSectionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className="section-y">
      <JsonLd data={faqLd(items)} />
      <div className="container-page grid gap-10 xl:grid-cols-[400px_1fr] xl:gap-14">
        <div className="flex flex-col items-start gap-5 xl:sticky xl:top-[calc(var(--nav-height)+32px)] xl:self-start">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className="type-h2 text-fg">
            {title}
          </h2>
          <p className="type-body-sm text-fg-muted">{intro}</p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/contact">
              Contact us <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <dl className="flex flex-col">
          {items.map((item) => (
            <div key={item.q} className="flex flex-col gap-3 border-b border-line-subtle py-6 first:pt-0 md:py-7 md:first:pt-0">
              <dt className="flex items-start justify-between gap-6 type-h5 text-fg">
                {item.q}
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-action-primary text-fg-on-brand" aria-hidden>
                  <Minus className="size-3.5" strokeWidth={2.5} />
                </span>
              </dt>
              <dd className="max-w-[640px] type-body-sm text-fg-muted md:type-body">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
