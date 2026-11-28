import { Accent } from '@/components/ui/accent';
import { BrandLogo } from '@/components/site/brand-logo';
import { SectionHeader } from '@/components/site/sections/section-header';
import { techStack } from '@/content/tech';

/**
 * 18-cell hairline grid (6 by 3 on desktop, 3 by 6 on tablet, 2 by 9 on
 * mobile). Brand marks are monochrome, generic concepts are line icons.
 * Figma: Technologies 93:19042, Tech Tile 18:2858
 */
export function TechGrid() {
  return (
    <section aria-labelledby="tech-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="tech-title"
          eyebrow="Engineering ecosystem"
          title={
            <>
              Technologies we <Accent>work with</Accent>
            </>
          }
          lede="We choose technologies based on your product goals, performance needs, budget and long-term scalability."
        />
        <ul className="mt-[var(--section-head-gap)] grid grid-cols-2 overflow-hidden rounded-[var(--card-radius)] border border-line-subtle bg-surface-1 md:grid-cols-3 xl:grid-cols-6">
          {techStack.map((t) => {
            const Icon = t.icon;
            return (
              <li
                key={t.name}
                className="-mt-px -ml-px flex flex-col gap-[18px] border-t border-l border-line-subtle px-5 py-6 md:px-6 md:py-7"
              >
                <span className="grid size-10 place-items-center text-icon-strong">
                  {t.brand ? (
                    <BrandLogo name={t.brand} className="size-8" />
                  ) : Icon ? (
                    <Icon className="size-8" strokeWidth={1.5} aria-hidden />
                  ) : null}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="type-label-lg text-fg">{t.name}</span>
                  <span className="type-mono-xs text-fg-subtle">{t.category}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
