import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { TagList } from '@/components/ui/tag';
import { SectionHeader } from '@/components/site/sections/section-header';
import { serviceHref, services } from '@/content/services';

/**
 * Typographic services index: seven full-width rows with hairlines. The whole
 * row links to the service page (stretched link on the title).
 * Figma: Services 92:19257
 */
export function ServicesIndex({
  eyebrow = 'What we build',
  title = (
    <>
      Seven ways we can <Accent>build for you</Accent>
    </>
  ),
  lede = 'We guide your digital product through every stage of development with precision and transparency.',
  id = 'services-title',
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  lede?: string;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="section-y">
      <div className="container-page">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} lede={lede} />
        <ol className="mt-[var(--section-head-gap)] border-t border-line-subtle">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.slug}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 border-b border-line-subtle py-6 transition-colors duration-[var(--duration-base)] hover:bg-hover md:gap-x-8 md:py-8 xl:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_220px_40px]"
              >
                <span className="flex items-center gap-3 self-start pt-1 xl:self-center xl:pt-0">
                  <span className="w-5 type-mono-sm text-fg-subtle tabular">{String(i + 1).padStart(2, '0')}</span>
                  <Icon className="size-6 text-icon-brand" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="type-h3 text-fg">
                  <Link
                    href={serviceHref(s.slug)}
                    className="rounded-sm after:absolute after:inset-0 focus-visible:focus-ring"
                  >
                    {s.title}
                  </Link>
                </h3>
                <span
                  aria-hidden
                  className="grid size-10 place-items-center self-start rounded-[var(--button-radius-sm)] bg-action-secondary text-icon-strong shadow-btn-secondary transition-[background-color,transform] duration-[var(--duration-fast)] group-hover:bg-action-primary group-hover:text-fg-on-brand group-hover:shadow-btn-primary xl:order-last xl:self-center"
                >
                  <ArrowUpRight className="size-[18px] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-px group-hover:-translate-y-px" />
                </span>
                <p className="col-span-3 type-body text-fg-muted max-xl:pl-[52px] max-md:pl-0 xl:col-span-1">
                  {s.description}
                </p>
                <TagList
                  items={s.stack}
                  className="col-span-3 max-xl:pl-[52px] max-md:pl-0 xl:col-span-1"
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
