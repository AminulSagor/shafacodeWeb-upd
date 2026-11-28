import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

type TextLinkProps = React.ComponentProps<typeof Link> & {
  /** Show the trailing arrow that nudges 2px on hover. Default true. */
  arrow?: boolean;
};

/** Brand text link with a nudging arrow. Figma: Link 12:2767 */
function TextLink({ className, children, arrow = true, ...props }: TextLinkProps) {
  return (
    <Link
      className={cn(
        'group/link inline-flex items-center gap-1.5 rounded-sm type-label-sm text-fg-brand transition-colors hover:text-fg-brand-hover focus-visible:focus-ring',
        className
      )}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowRight
          className="size-4 transition-transform duration-[var(--duration-fast)] ease-out group-hover/link:translate-x-0.5"
          aria-hidden
        />
      )}
    </Link>
  );
}

export { TextLink };
