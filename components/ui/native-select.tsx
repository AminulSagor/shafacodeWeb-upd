import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { fieldBase } from '@/components/ui/input';

/**
 * Native <select> styled as the recessed field. Used in public forms: it works
 * without JavaScript, posts with FormData and uses the platform picker on phones.
 */
function NativeSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        data-slot="native-select"
        className={cn(
          fieldBase,
          'h-control cursor-pointer appearance-none truncate pr-10 pl-3.5',
          'invalid:text-fg-subtle',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-icon"
        aria-hidden
      />
    </div>
  );
}

export { NativeSelect };
