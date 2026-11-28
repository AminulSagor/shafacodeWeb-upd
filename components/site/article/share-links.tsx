'use client';

import { Check, Link2 } from 'lucide-react';

import { IconButton } from '@/components/ui/icon-button';
import { useFlash } from '@/lib/use-flash';

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
    </svg>
  );
}

/** Share on LinkedIn or Facebook, or copy the link. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, flash] = useFlash();
  const u = encodeURIComponent(url);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash();
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 type-mono-xs text-fg-subtle">Share</span>
      <IconButton asChild size="sm" className="rounded-full" aria-label={`Share “${title}” on LinkedIn`}>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon />
        </a>
      </IconButton>
      <IconButton asChild size="sm" className="rounded-full" aria-label={`Share “${title}” on Facebook`}>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer">
          <FacebookIcon />
        </a>
      </IconButton>
      <IconButton size="sm" className="rounded-full" aria-label={copied ? 'Link copied' : 'Copy link'} onClick={copy}>
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
      </IconButton>
      <span role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
