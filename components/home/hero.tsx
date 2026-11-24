import Link from 'next/link';
import { Fingerprint, MousePointer2, PlayCircle, Tag, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { trustedBrands } from '@/data/home';

const floaters = [
  { Icon: Zap, className: 'left-[9%] top-[38%] h-16 w-16' },
  { Icon: Fingerprint, className: 'left-[18%] top-[44%] h-12 w-12' },
  { Icon: Tag, className: 'left-[14%] top-[66%] h-14 w-14' },
];

const HeroSection = () => {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(110,170,10,0.45),transparent_70%)] pb-24 pt-44 sm:pt-52">
        {floaters.map(({ Icon, className }, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute hidden place-items-center rounded-full bg-brand/10 text-brand lg:grid ${className}`}
          >
            <Icon className="h-1/2 w-1/2" />
          </span>
        ))}
        <MousePointer2
          aria-hidden
          className="absolute right-[10%] top-[48%] hidden h-14 w-14 fill-brand text-brand lg:block"
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <h1 className="font-display text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Transparent Software Partner for{' '}
            <em className="block text-brand/90">Growing Teams</em>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            ShafaCode helps growing businesses build websites, apps, SaaS
            platforms, custom software, and IoT solutions with clear
            communication, transparent milestones, and scalable engineering.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-lg bg-brand px-6 font-semibold text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90 sm:w-auto"
            >
              <Link href="/#contact">Get Free Consultation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-lg border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/portfolio">
                <PlayCircle className="mr-1 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-label="Trusted by"
        className="border-y border-white/5 py-10"
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
          Trusted by teams around the world
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-16 pr-16">
            {[...trustedBrands, ...trustedBrands, ...trustedBrands, ...trustedBrands].map(
              (brand, i) => (
                <span
                  key={i}
                  aria-hidden={i >= trustedBrands.length}
                  className="text-4xl font-bold tracking-tight text-white/15"
                >
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
