import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/home';

type Service = (typeof services)[number];

const ServiceCard = ({
  service,
  align,
}: {
  service: Service;
  align: 'left' | 'right';
}) => (
  <div
    className={`rounded-xl border border-white/10 bg-surface/80 p-8 ${
      align === 'right' ? 'md:text-right' : ''
    }`}
  >
    <h3 className="text-2xl leading-snug">{service.title}</h3>
    <p className="mt-3 text-slate-300">{service.description}</p>
    <Link
      href={service.href}
      className={`mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline ${
        align === 'right' ? 'md:flex-row' : ''
      }`}
    >
      {service.cta}
      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  </div>
);

const Node = ({ n }: { n: number }) => (
  <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-brand bg-surface text-sm text-brand">
    {String(n).padStart(2, '0')}
  </span>
);

const IconBubble = ({ service }: { service: Service }) => (
  <span className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-panel shadow-[0_0_30px_-8px_var(--color-brand)]">
    <service.icon className="h-8 w-8 text-brand" />
  </span>
);

const Offer = () => {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 bg-[radial-gradient(ellipse_50%_20%_at_50%_8%,rgba(170,242,0,0.12),transparent_70%)] px-4 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-medium sm:text-5xl">
          What We Can <em className="text-brand">Build</em> for You ?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-slate-300">
          We guide your digital product through every stage of development with
          precision and transparency.
        </p>
      </div>

      {/* Desktop: alternating timeline */}
      <div className="relative mx-auto mt-16 hidden max-w-5xl md:block">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-brand/60 via-brand/30 to-transparent" />
        <ol className="space-y-12">
          {services.map((service, i) => {
            const cardLeft = i % 2 === 0;
            return (
              <li
                key={service.title}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
              >
                <div className="flex justify-end">
                  {cardLeft ? (
                    <div className="w-full max-w-sm">
                      <ServiceCard service={service} align="right" />
                    </div>
                  ) : (
                    <IconBubble service={service} />
                  )}
                </div>
                <Node n={i + 1} />
                <div className="flex justify-start">
                  {cardLeft ? (
                    <IconBubble service={service} />
                  ) : (
                    <div className="w-full max-w-sm">
                      <ServiceCard service={service} align="left" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: single column */}
      <div className="relative mx-auto mt-12 max-w-xl md:hidden">
        <div className="absolute inset-y-0 left-7 w-px bg-brand/30" />
        <ol className="space-y-8">
          {services.map((service, i) => (
            <li key={service.title} className="flex gap-4">
              <Node n={i + 1} />
              <div className="flex-1">
                <ServiceCard service={service} align="left" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Offer;
