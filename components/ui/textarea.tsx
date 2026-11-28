import * as React from 'react';

import { cn } from '@/lib/utils';
import { fieldBase } from '@/components/ui/input';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, 'block min-h-32 resize-y px-3.5 py-3', className)}
      {...props}
    />
  );
}

export { Textarea };
