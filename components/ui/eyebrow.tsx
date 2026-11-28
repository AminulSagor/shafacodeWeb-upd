import { cn } from '@/lib/utils';

/** `[ LABEL ]` in Geist Mono. Not a heading: renders a <p>. Figma: Eyebrow 12:2787 */
function Eyebrow({
  children,
  className,
  as: Tag = 'p',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag className={cn('flex min-h-7 items-center gap-1.5 type-eyebrow', className)}>
      <span className="text-fg-subtle" aria-hidden>
        [
      </span>
      <span className="text-fg-brand">{children}</span>
      <span className="text-fg-subtle" aria-hidden>
        ]
      </span>
    </Tag>
  );
}

export { Eyebrow };
