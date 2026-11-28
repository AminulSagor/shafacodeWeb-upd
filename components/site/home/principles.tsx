import { Accent } from '@/components/ui/accent';
import { SectionHeader } from '@/components/site/sections/section-header';

const principles = [
  {
    title: 'Product minded',
    body: 'We do not just write code. We think about users, business goals, usability and long-term growth. Strategic engineering for real impact.',
  },
  {
    title: 'Transparent dev',
    body: 'Every milestone, decision and update stays clear, so you always know what is happening. Total visibility from sprint zero to deployment.',
  },
  {
    title: 'Scalable engineering',
    body: 'We build with modern technologies, clean structure and future expansion in mind. Architecture designed to evolve with your business.',
  },
];

/** Restored from the old site. Figma: Why businesses choose 92:19390 */
export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="principles-title"
          eyebrow="Our principles"
          title={
            <>
              Why businesses <Accent>choose ShafaCode</Accent>
            </>
          }
          lede="Engineered for performance. Designed for humans. We build software that powers growing companies."
        />
        <ol className="mt-[var(--section-head-gap)] grid border-y border-line-subtle md:grid-cols-3">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className="border-line-subtle py-8 max-md:border-b max-md:last:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
            >
              <p className="type-stat text-fg-brand" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 type-h3 text-fg">{p.title}</h3>
              <p className="mt-5 max-w-[360px] type-body text-fg-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
