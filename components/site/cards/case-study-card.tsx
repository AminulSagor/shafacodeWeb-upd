import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { CaseStudySummary } from '@/content/case-studies';

export const caseStudyHref = (slug: string) => `/portfolio/${slug}`;

/**
 * Case study card: media on top, body with tags, title, summary and a
 * footer link on the shared bottom line. Stretched link on the title.
 * Figma: Case Study Card 17:2734
 */
export function CaseStudyCard({
  item,
  className,
  sizes = '(min-width: 1280px) 608px, (min-width: 768px) 46vw, 92vw',
  headingLevel: H = 'h3',
}: {
  item: CaseStudySummary;
  className?: string;
  sizes?: string;
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <article
      className={cn(
        'group card-focus relative flex h-full flex-col overflow-hidden rounded-md border border-line-subtle bg-surface-1 transition-[border-color,translate] duration-(--duration-base) ease-out hover:border-line-brand motion-safe:hover:-translate-y-0.5',
        className
      )}
    >
      {item.cover && (
        <div className="relative h-media-card w-full overflow-hidden bg-surface-2">
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-(--duration-slow) ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-card">
        <ul className="flex flex-wrap gap-x-2 type-mono-xs text-fg-subtle" aria-label="Tags">
          {item.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <H className="type-h4 text-fg">
          <Link href={caseStudyHref(item.slug)} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </H>
        <p className="type-body-sm text-fg-muted">{item.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 type-label text-fg-brand" aria-hidden>
          Read the case study
          <ArrowRight className="size-4 shrink-0 transition-transform duration-(--duration-fast) motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
