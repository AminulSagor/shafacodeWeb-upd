'use client';

import * as React from 'react';
import Image from 'next/image';
import * as Tabs from '@radix-ui/react-tabs';
import { Play } from 'lucide-react';

import { partnerVideos } from '@/content/affiliate';

type Lang = (typeof partnerVideos)[number]['lang'];

/**
 * Click-to-load YouTube facade with an English / Bangla switch (Radix tabs:
 * arrow keys, roving focus, linked panels). No YouTube script loads until the
 * visitor presses play; focus moves into the player when it does.
 */
export function PartnerVideo() {
  const [lang, setLang] = React.useState<Lang>('en');
  const [playing, setPlaying] = React.useState<Lang | null>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <Tabs.Root
      value={lang}
      onValueChange={(v) => {
        setLang(v as Lang);
        setPlaying(null);
      }}
    >
      <Tabs.List aria-label="Video language" className="flex gap-5 border-b border-line-subtle">
        {partnerVideos.map((v) => (
          <Tabs.Trigger
            key={v.lang}
            value={v.lang}
            lang={v.lang}
            className="-mb-px cursor-pointer border-b-2 border-transparent pb-2 type-label-sm text-fg-subtle transition-colors hover:text-fg focus-visible:focus-ring data-[state=active]:border-action-primary data-[state=active]:text-fg"
          >
            {v.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {partnerVideos.map((video) => (
        <Tabs.Content key={video.lang} value={video.lang} className="relative mt-4 aspect-video overflow-hidden rounded-card bg-surface-1 focus-visible:focus-ring">
          {playing === video.lang ? (
            <iframe
              ref={frameRef}
              className="absolute inset-0 size-full"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`Partner program explained (${video.label})`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(video.lang)}
              className="group absolute inset-0 grid cursor-pointer place-items-center focus-visible:focus-ring"
              aria-label={`Play the partner program video (${video.label})`}
            >
              <Image
                src="/images/affiliate/partner-handshake.jpg"
                alt=""
                fill
                sizes="(min-width: 1280px) 776px, 92vw"
                className="object-cover"
              />
              <span className="relative grid size-16 place-items-center rounded-full bg-action-primary text-fg-on-brand shadow-btn-primary transition-transform motion-safe:group-hover:scale-105 md:size-21">
                <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
              </span>
            </button>
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
