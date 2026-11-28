import Image from 'next/image';
import { Play } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { SectionHeader } from '@/components/site/sections/section-header';
import { VideoDialog } from '@/components/site/video-dialog';
import type { VideoStory } from '@/content/testimonials';

function Poster({ story }: { story: VideoStory }) {
  const inner = (
    <>
      <Image
        src={story.poster.src}
        alt={story.poster.alt}
        fill
        sizes="(min-width: 1280px) 397px, (min-width: 768px) 31vw, 92vw"
        className={story.youtubeId ? 'object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-[1.03]' : 'object-cover'}
      />
      <span className="absolute bottom-3 left-3 inline-flex xl:bottom-5 xl:left-5 items-center gap-2.5 rounded-full bg-action-primary py-2 pr-4 pl-2 text-fg-on-brand">
        <span className="grid size-8 place-items-center rounded-full bg-fg-on-brand text-action-primary">
          <Play className="size-3.5 translate-x-px fill-current" aria-hidden />
        </span>
        <span className="type-label-sm">
          {story.youtubeId ? 'Play story' : 'Video soon'} · {story.duration}
        </span>
      </span>
    </>
  );
  const frame = 'relative block aspect-[397/300] w-full overflow-hidden rounded-[var(--card-radius)] bg-surface-1';
  if (!story.youtubeId) return <div className={frame}>{inner}</div>;
  return (
    <VideoDialog video={{ title: `${story.name}, ${story.role}`, duration: story.duration, youtubeId: story.youtubeId }}>
      <button type="button" className={`${frame} group cursor-pointer focus-visible:focus-ring`} aria-label={`Play story: ${story.name}, ${story.duration}`}>
        {inner}
      </button>
    </VideoDialog>
  );
}

/** Restored from the old site. Figma: Video success stories 94:18974 */
export function VideoStories({ items }: { items: VideoStory[] }) {
  return (
    <section aria-labelledby="stories-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="stories-title"
          eyebrow="Video stories"
          title={
            <>
              Video <Accent>success stories</Accent>
            </>
          }
          lede="See the impact of ShafaCode engineering in action, in the words of the founders we build with."
        />
        <ul className="mt-[var(--section-head-gap)] grid gap-x-6 gap-y-10 md:grid-cols-3">
          {items.map((s) => (
            <li key={s.name}>
              <figure className="flex h-full flex-col gap-5">
                <Poster story={s} />
                <blockquote className="type-body-lg text-fg">
                  <p>“{s.quote}”</p>
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5">
                  <span className="type-label text-fg">{s.name}</span>
                  <span className="type-caption font-normal text-fg-subtle">{s.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
