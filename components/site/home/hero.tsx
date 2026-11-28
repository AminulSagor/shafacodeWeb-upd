import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { VideoDialog } from '@/components/site/video-dialog';
import { HeroRotator } from '@/components/site/home/hero-rotator';
import { hasVideo, homeDemoVideo } from '@/content/media';

const trustPhotos = ['/images/people/trust-1.jpg', '/images/people/trust-2.jpg', '/images/people/trust-3.jpg'];

function PlayPill({ label, sub }: { label: string; sub: string }) {
  return (
    <span className="relative inline-flex items-center gap-3 rounded-full bg-action-primary py-2.5 pr-5.5 pl-2.5 text-fg-on-brand shadow-btn-primary transition-transform duration-(--duration-base) ease-out motion-safe:group-hover/reel:scale-[1.03]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(50%_100%_at_50%_0%,rgb(255_255_255/0.42),transparent)]"
      />
      <span className="relative grid size-11 place-items-center rounded-full bg-fg-on-brand text-action-primary">
        <Play className="size-[18px] translate-x-px fill-current" aria-hidden />
      </span>
      <span className="relative flex flex-col text-left">
        <span className="type-label">{label}</span>
        <span className="type-caption">{sub}</span>
      </span>
    </span>
  );
}

function Showreel() {
  const media = (
    <>
      <Image
        src="/images/home/showreel-team-studio.jpg"
        alt="The ShafaCode team planning a mobile app at a lime project wall in a bright studio"
        fill
        preload
        sizes="(min-width: 1340px) 1240px, 92vw"
        className="object-cover transition-transform duration-(--duration-slower) ease-out motion-safe:group-hover/reel:scale-[1.02]"
      />
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(13_15_15/0.78))]" />
      <span className="absolute inset-0 grid place-items-center">
        {hasVideo(homeDemoVideo) ? (
          <PlayPill label="Watch demo" sub={`${homeDemoVideo.duration} · how we work`} />
        ) : (
          <PlayPill label="See our work" sub="Case studies · how we work" />
        )}
      </span>
      <span className="absolute bottom-5 left-5 flex max-w-[calc(100%-40px)] flex-col gap-2 text-left md:bottom-8 md:left-8">
        <span className="type-eyebrow text-fg-brand">[ Showreel 2026 ]</span>
        <span className="type-h5 text-fg max-md:hidden">From first call to launch, with the team that builds it.</span>
      </span>
      <span className="absolute right-8 bottom-[34px] type-mono-xs text-fg-muted max-xl:hidden">
        Web · Mobile · SaaS · IoT
      </span>
    </>
  );

  const frame =
    'group/reel relative block aspect-[4/3] w-full overflow-hidden rounded-card bg-surface-1 focus-visible:focus-ring md:aspect-[16/9] xl:aspect-auto xl:h-[600px]';

  return hasVideo(homeDemoVideo) ? (
    <VideoDialog video={homeDemoVideo}>
      <button type="button" className={`${frame} cursor-pointer`} aria-label={`Play video: ${homeDemoVideo.title}`}>
        {media}
      </button>
    </VideoDialog>
  ) : (
    <Link href="/portfolio" className={frame} aria-label="See our work: case studies">
      {media}
    </Link>
  );
}

/** Home hero. Figma: Hero 91:19166 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      {/* Soft radial glows, fading to transparent inside their own box */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -top-nav -z-10 overflow-x-clip">
        <div className="absolute -top-[448px] left-[calc(50%-1140px)] h-[1000px] w-[1500px] bg-glow opacity-25" />
        <div className="absolute -top-[228px] left-[calc(50%+100px)] h-[900px] w-[1000px] bg-glow opacity-15 max-md:hidden" />
      </div>

      <div className="container-page flex flex-col gap-10 pt-10 pb-6 md:gap-12 md:pt-14 xl:pt-18">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>Software studio · Barishal, Bangladesh</Eyebrow>
          <p className="flex items-center gap-2 type-mono-xs text-fg-muted">
            <span className="size-2 rounded-full bg-fg-success" aria-hidden />
            Now booking new projects
          </p>
        </div>

        <h1 id="hero-title" className="type-display text-fg">
          Transparent software partner for <HeroRotator />
        </h1>

        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <p className="max-w-[560px] type-body-lg text-fg-muted">
            ShafaCode helps growing businesses build websites, apps, SaaS platforms, custom software and IoT
            products with clear communication, transparent milestones and scalable engineering.
          </p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact?type=consultation">
                  Get a free consultation <ArrowRight aria-hidden />
                </Link>
              </Button>
              {hasVideo(homeDemoVideo) ? (
                <VideoDialog video={homeDemoVideo}>
                  <Button size="lg" variant="secondary">
                    <Play aria-hidden /> Watch demo
                  </Button>
                </VideoDialog>
              ) : (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/portfolio">See our work</Link>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex" aria-hidden>
                {trustPhotos.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="-mr-2.5 size-8 rounded-full border-2 border-canvas object-cover last:mr-0"
                  />
                ))}
              </span>
              <p className="type-body-sm text-fg-muted">
                <span className="font-medium text-fg">120+ projects delivered</span> · 99% client satisfaction
              </p>
            </div>
          </div>
        </div>

        <Showreel />
      </div>
    </section>
  );
}
