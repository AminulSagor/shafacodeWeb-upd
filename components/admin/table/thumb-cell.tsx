import Link from 'next/link';
import { ImageIcon } from 'lucide-react';

/** Thumbnail, title (stretched link) and a meta line. */
export function ThumbCell({ src, title, meta, href }: { src: string | null; title: string; meta?: string; href: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
        <img src={src} alt="" className="size-10 shrink-0 rounded-xs object-cover" loading="lazy" />
      ) : (
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xs bg-surface-2 text-icon-muted">
          <ImageIcon className="size-4" />
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <Link href={href} className="truncate rounded-sm type-label text-fg after:absolute after:inset-0 hover:underline focus-visible:focus-ring">
          {title}
        </Link>
        {meta && <span className="truncate type-caption font-normal text-fg-subtle">{meta}</span>}
      </span>
    </div>
  );
}
