import Link from 'next/link';
import { CircleHelp, Minus, Plus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/data/home';

const Faq = () => {
  return (
    <section id="faq" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-200">
            <CircleHelp className="h-3.5 w-3.5 text-brand" />
            FAQ
          </span>
          <p className="mt-6 text-sm">
            Common Questions Before Starting a Project
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand/90"
          >
            Contact Us
          </Link>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-3"
        >
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="group rounded-xl border border-white/10 bg-panel px-6 last:border-b"
            >
              <AccordionTrigger className="py-6 text-base font-normal hover:no-underline [&>svg]:hidden items-center">
                <span className="flex-1 text-left">{f.q}</span>
                <span className="shrink-0" aria-hidden>
                  <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                  <Minus className="hidden h-4 w-4 group-data-[state=open]:block" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-300">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
