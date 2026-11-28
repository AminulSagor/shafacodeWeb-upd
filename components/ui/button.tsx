import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Tactile button (Polaris idiom, ported from Dakghor): a light inner top edge
 * and a darker inner bottom lip; pressed sinks 1px. No gradients, no outer
 * shadow. Figma: Button 12:2685 (sizes L 52 / M 44 / S 36).
 */
const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none',
    'transition-[background-color,box-shadow,translate,color] duration-100 ease-out',
    'cursor-pointer focus-visible:focus-ring active:not-aria-[haspopup]:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-action-primary text-fg-on-brand shadow-btn-primary hover:bg-action-primary-hover active:shadow-btn-primary-pressed',
        secondary:
          'bg-action-secondary text-fg shadow-btn-secondary hover:bg-action-secondary-hover active:shadow-btn-secondary-pressed',
        ghost: 'bg-transparent text-fg hover:bg-hover active:bg-pressed disabled:opacity-40',
        danger:
          'bg-action-danger text-fg-on-danger shadow-btn-secondary hover:opacity-90 active:shadow-btn-secondary-pressed',
        link: 'h-auto! px-0! text-fg-brand underline-offset-4 hover:underline',
        // shadcn names kept for screens not rebuilt yet
        default: '',
        outline: '',
        destructive: '',
      },
      size: {
        sm: "h-9 gap-1.5 rounded-[var(--button-radius-sm)] px-3.5 type-label-sm [&_svg:not([class*='size-'])]:size-4",
        md: "h-[var(--button-height)] gap-2 rounded-[var(--button-radius)] px-5 type-label [&_svg:not([class*='size-'])]:size-[18px]",
        lg: "h-[52px] gap-2.5 rounded-[var(--button-radius-lg)] px-6 type-label-lg [&_svg:not([class*='size-'])]:size-5",
        icon: "size-[var(--button-height)] rounded-[var(--button-radius)] [&_svg:not([class*='size-'])]:size-[18px]",
        'icon-sm': "size-9 rounded-[var(--button-radius-sm)] [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': "size-[52px] rounded-[var(--button-radius-lg)] [&_svg:not([class*='size-'])]:size-5",
        default: '',
      },
    },
    compoundVariants: [
      { variant: 'default', class: 'bg-action-primary text-fg-on-brand shadow-btn-primary hover:bg-action-primary-hover active:shadow-btn-primary-pressed' },
      { variant: 'outline', class: 'bg-action-secondary text-fg shadow-btn-secondary hover:bg-action-secondary-hover active:shadow-btn-secondary-pressed' },
      { variant: 'destructive', class: 'bg-action-danger text-fg-on-danger shadow-btn-secondary hover:opacity-90' },
      { size: 'default', class: "h-[var(--button-height)] gap-2 rounded-[var(--button-radius)] px-5 type-label [&_svg:not([class*='size-'])]:size-[18px]" },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  /** Keeps the width, shows a spinner and sets aria-busy. */
  loading?: boolean;
};

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : loading ? (
        <>
          <span className="invisible inline-flex items-center gap-[inherit]">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin" aria-hidden />
            <span className="sr-only">Loading</span>
          </span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
