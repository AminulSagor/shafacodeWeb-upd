import { cn } from '@/lib/utils';

/**
 * The one lime serif accent phrase inside a heading. inline-block from tablet
 * up so the phrase never splits: when it would wrap it moves to its own line
 * as a whole (matches the Figma frames).
 */
function Accent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <em className={cn('heading-accent md:inline-block', className)}>{children}</em>;
}

export { Accent };
