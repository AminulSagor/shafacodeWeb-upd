import { clientNames } from '@/content/testimonials';

/**
 * Calm logo row on desktop; below 1280px a marquee that pauses on hover and
 * focus and stops under reduced motion. Figma: Client logos 24:2522
 * TODO(owner): replace the wordmarks with the real client logos (spec 14).
 */
export function ClientLogos() {
  const item = 'shrink-0 type-h5 text-fg-subtle whitespace-nowrap';
  return (
    <section aria-labelledby="clients-title" className="border-y border-line-subtle py-10">
      <div className="container-page">
        <h2 id="clients-title" className="text-center type-mono-xs text-fg-subtle">
          Trusted by founders and teams at
        </h2>
        <ul className="mt-6 hidden items-center justify-between px-3 xl:flex">
          {clientNames.map((n) => (
            <li key={n} className={item}>
              {n}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="group mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] xl:hidden"
        tabIndex={0}
        aria-label="Client list"
      >
        <ul className="flex w-max animate-marquee gap-12 pr-12 group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused] motion-reduce:animate-none">
          {[...clientNames, ...clientNames].map((n, i) => (
            <li key={i} className={item} aria-hidden={i >= clientNames.length || undefined}>
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
