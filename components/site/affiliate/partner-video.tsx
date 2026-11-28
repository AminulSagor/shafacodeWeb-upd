'use client';

import * as React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

import { cn } from '@/lib/utils';
import { partnerVideos } from '@/content/affiliate';

/**
 * Click-to-load YouTube facade with an English / Bangla switch. No YouTube
 * script loads until the visitor presses play; nothing opens on page load.
 */
export function PartnerVideo() {
  const [lang, setLang] = React.useState<(typeof partnerVideos)[number]['lang']>('en');
  const [playing, setPlaying] = React.useState(false);
  const video = partnerVideos.find((v) => v.lang === lang) ?? partnerVideos[0];

  return (
    <div>
      <div role="tablist" aria-label="Video language" className="flex gap-5 border-b border-line-subtle">
        {partnerVideos.map((v) => (
          <button
            key={v.lang}
            type="button"
            role="tab"
            aria-selected={lang === v.lang}
            onClick={() => {
              setLang(v.lang);
              setPlaying(false);
            }}
            className={cn(
              '-mb-px border-b-2 pb-2 type-label-sm transition-colors focus-visible:focus-ring',
              lang === v.lang ? 'border-action-primary text-fg' : 'border-transparent text-fg-subtle hover:text-fg'
            )}
            lang={v.lang}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="relative mt-4 aspect-video overflow-hidden rounded-card bg-surface-1">
        {playing ? (
          <iframe
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
            onClick={() => setPlaying(true)}
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
            <span className="relative grid size-16 place-items-center rounded-full bg-action-primary text-fg-on-brand shadow-btn-primary transition-transform motion-safe:group-hover:scale-105 md:size-[84px]">
              <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
