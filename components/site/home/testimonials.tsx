import Image from 'next/image';

import { Accent } from '@/components/ui/accent';
import { SectionHeader } from '@/components/site/sections/section-header';
import type { TextTestimonial } from '@/content/testimonials';

/** Three large quotes in a hairline grid. Figma: Testimonials 94:18937 */
export function Testimonials({ items }: { items: TextTestimonial[] }) {
  return (
    <section aria-labelledby="quotes-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="quotes-title"
          eyebrow="Client stories"
          title={
            <>
              What clients say about <Accent>working with us</Accent>
            </>
          }
          lede="Real feedback from founders and product teams we have shipped with."
        />
        <ul className="mt-[var(--section-head-gap)] grid border-y border-line-subtle md:grid-cols-3">
          {items.map((t) => (
            <li
              key={t.name}
              className="flex h-full flex-col border-line-subtle py-8 max-md:border-b max-md:last:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
            >
              <figure className="flex h-full flex-col">
                <span aria-hidden className="h-12 type-h1 leading-none text-fg-brand md:h-[62px]">
                  “
                </span>
                <blockquote className="mt-2 type-h4 text-fg">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3.5 pt-8">
                  <Image
                    src={t.photo}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="type-label text-fg">{t.name}</span>
                    <span className="type-caption font-normal text-fg-subtle">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
