import { Accent } from '@/components/ui/accent';
import { Eyebrow } from '@/components/ui/eyebrow';
import { TimezoneOverlap } from '@/components/site/interactive/timezone-overlap';

/** Figma: Work from anywhere 44:5343 */
export function WorkAnywhere() {
  return (
    <section aria-labelledby="anywhere-title" className="section-y">
      <div className="container-page grid items-center gap-10 xl:grid-cols-[minmax(0,--spacing(156))_minmax(0,--spacing(140))] xl:justify-between">
        <div className="flex flex-col items-start">
          <Eyebrow>Global delivery</Eyebrow>
          <h2 id="anywhere-title" className="mt-4 type-h2 text-fg">
            Based in Bangladesh, working <Accent>on your clock</Accent>
          </h2>
          <p className="mt-4 type-body-lg text-fg-muted">
            Pick your city to see how many working hours we share. Daily standups, same-day answers on WhatsApp and
            Slack, and a written update every Friday.
          </p>
        </div>
        <TimezoneOverlap />
      </div>
    </section>
  );
}
