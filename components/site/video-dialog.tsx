'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { IconButton } from '@/components/ui/icon-button';
import type { VideoSource } from '@/content/media';

/**
 * Video modal (Figma "Overlay · Demo video"): 1120px player, close button,
 * Radix Dialog (focus trap, Escape, focus return). The player loads only after
 * the click. Pass the trigger as children.
 */
export function VideoDialog({ video, children }: { video: VideoSource; children: React.ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-scrim backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-[60] w-dialog -translate-x-1/2 -translate-y-1/2 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <Dialog.Title className="type-label text-fg">
              {video.title} <span className="text-fg-subtle">· {video.duration}</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton aria-label="Close video">
                <X aria-hidden />
              </IconButton>
            </Dialog.Close>
          </div>
          <div className="aspect-video overflow-hidden rounded-card border border-line bg-surface-1">
            {video.youtubeId ? (
              <iframe
                className="size-full"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1&rel=0&modestbranding=1`}
                referrerPolicy="strict-origin-when-cross-origin"
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : video.src ? (
              <video className="size-full" src={video.src} controls autoPlay playsInline />
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
