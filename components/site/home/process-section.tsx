import { Accent } from '@/components/ui/accent';
import { SectionHeader } from '@/components/site/sections/section-header';
import { ProcessDiagram } from '@/components/site/process/process-diagram';

/** Figma: Process 25:2885 (Kinetic Core, no outer box, nothing clipped) */
export function ProcessSection({ id = 'process' }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y">
      <div className="container-page">
        <SectionHeader
          id={`${id}-title`}
          eyebrow="How we work"
          title={
            <>
              A kinetic process, from <Accent>first message to launch</Accent>
            </>
          }
          lede="Six transparent stages with demos and written updates, so you always know what is happening and what comes next."
        />
        <div className="mt-[var(--section-head-gap)]">
          <ProcessDiagram />
        </div>
      </div>
    </section>
  );
}
