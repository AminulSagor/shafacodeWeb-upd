import { cn } from '@/lib/utils';

/** Plain mono label, no box. Figma: Tag 17:2617 */
function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('type-mono-xs text-fg-subtle', className)}>{children}</span>;
}

/** Tags joined with mono separators, e.g. `NEXT.JS / NODE.JS`. */
function TagList({
  items,
  separator = '/',
  className,
}: {
  items: readonly string[];
  separator?: string;
  className?: string;
}) {
  return (
    <p className={cn('type-mono-xs text-fg-subtle', className)}>
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 && <span aria-hidden>{` ${separator} `}</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

export { Tag, TagList };
