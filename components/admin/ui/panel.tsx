import Link from 'next/link';

import { cn } from '@/lib/utils';

/** Bordered admin card with a title row and optional link. Figma: Card header in Dashboard 55:2655 */
export function Panel({
  title,
  titleId,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: React.ReactNode;
  titleId?: string;
  action?: { href: string; label: string; srLabel?: string };
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section aria-labelledby={titleId} className={cn('min-w-0 overflow-hidden rounded-md border border-line-subtle bg-surface-1', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line-subtle px-5 py-4">
        <h2 id={titleId} className="type-h5 text-fg">
          {title}
        </h2>
        {action && (
          <Link href={action.href} className="rounded-sm type-label-sm text-fg-brand hover:text-fg-brand-hover focus-visible:focus-ring">
            {action.label}
            {action.srLabel && <span className="sr-only"> {action.srLabel}</span>}
          </Link>
        )}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
