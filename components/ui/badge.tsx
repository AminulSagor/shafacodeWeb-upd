import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/** Status badge. Tones neutral, brand, success, warning, danger, info. Figma: Badge 12:2786 */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-[8px] px-2 py-0.5 type-label-xs whitespace-nowrap [&>svg]:size-3 [&>svg]:shrink-0',
  {
    variants: {
      tone: {
        neutral: 'bg-status-neutral text-fg-muted',
        brand: 'bg-brand-soft text-fg-brand',
        success: 'bg-status-success text-fg-success',
        warning: 'bg-status-warning text-fg-warning',
        danger: 'bg-status-danger text-fg-danger',
        info: 'bg-status-info text-fg-info',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
);

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    /** shadcn names still used by the old admin screens */
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    dot?: boolean;
  };

const legacyTone = { default: 'brand', secondary: 'neutral', destructive: 'danger', outline: 'neutral' } as const;

function Badge({ className, tone, variant, dot, children, ...props }: BadgeProps) {
  const t = tone ?? (variant ? legacyTone[variant] : undefined);
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone: t }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
