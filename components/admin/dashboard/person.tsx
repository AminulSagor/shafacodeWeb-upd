import Link from 'next/link';

import { initials } from '@/lib/admin/format';

/** Initials avatar, name and a secondary line; the name links to the record. */
export function Person({ name, sub, href, size = 'md' }: { name: string; sub?: string; href?: string; size?: 'sm' | 'md' }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center rounded-full bg-surface-3 text-fg-muted ${size === 'md' ? 'size-10 type-label-sm' : 'size-8 type-label-xs'}`}
      >
        {initials(name)}
      </span>
      <span className="flex min-w-0 flex-col">
        {href ? (
          <Link href={href} className="truncate rounded-sm type-label text-fg after:absolute after:inset-0 hover:underline focus-visible:focus-ring">
            {name}
          </Link>
        ) : (
          <span className="truncate type-label text-fg">{name}</span>
        )}
        {sub && <span className="truncate type-caption font-normal text-fg-subtle">{sub}</span>}
      </span>
    </div>
  );
}
