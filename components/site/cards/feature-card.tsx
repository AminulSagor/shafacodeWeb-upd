import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Icon, title and body. Figma: Feature Card 18:2850 */
export function FeatureCard({
  icon: Icon,
  title,
  body,
  className,
  as: H = 'h3',
}: {
  icon: LucideIcon;
  title: string;
  body: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3';
}) {
  return (
    <div className={cn('flex h-full flex-col rounded-md border border-line-subtle p-[var(--card-pad)] md:p-[var(--card-pad-lg)]', className)}>
      <span className="grid size-6 place-items-center text-icon-brand">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <H className="mt-6 type-h4 text-fg">{title}</H>
      <p className="mt-3 type-body-sm text-fg-muted">{body}</p>
    </div>
  );
}
