import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type IconButtonProps = React.ComponentProps<'button'> & {
  /** Required: icon-only controls need an accessible name. */
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
};

const sizeMap = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const;

/**
 * Square icon button. On touch devices the hit area grows to 44px even when
 * the visible box is smaller. Figma: Icon Button 12:2746
 */
function IconButton({ className, variant = 'secondary', size = 'md', asChild, ...props }: IconButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size: sizeMap[size] }),
        'pointer-coarse:after:absolute pointer-coarse:after:-inset-1 pointer-coarse:after:content-[""]',
        className
      )}
      {...props}
    />
  );
}

export { IconButton };
