import { clientNames } from '@/content/testimonials';

/**
 * A calm, static logo row (Figma Client logos 24:2522): one line on desktop,
 * a wrapped grid on tablet and phones as in the tablet and mobile frames.
 * Static on purpose: a marquee would need its own pause control (WCAG 2.2.2).
 * TODO(owner): replace the wordmarks with the real client logos (spec 14).
 */
export function ClientLogos() {
  return (
    <section aria-labelledby="clients-title" className="border-y border-line-subtle py-10">
      <div className="container-page">
        <h2 id="clients-title" className="text-center type-mono-xs text-fg-subtle">
          Trusted by founders and teams at
        </h2>
        <ul className="mx-auto mt-6 grid max-w-160 grid-cols-2 justify-items-center gap-x-6 gap-y-5 md:flex md:max-w-none md:flex-wrap md:justify-center md:gap-x-14 xl:flex-nowrap xl:justify-between xl:px-3">
          {clientNames.map((n, i) => (
            <li
              key={n}
              className={`type-h5 whitespace-nowrap text-fg-subtle ${i === clientNames.length - 1 && clientNames.length % 2 === 1 ? 'col-span-2' : ''}`}
            >
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
