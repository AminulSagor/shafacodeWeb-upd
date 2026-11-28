'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionResult } from '@/lib/admin/action';

/** Button that runs a server action and reports the result in a toast. */
export function ActionButton({ action, children, ...props }: Omit<ButtonProps, 'onClick'> & { action: () => Promise<ActionResult<unknown>> }) {
  const [pending, startTransition] = React.useTransition();
  return (
    <Button
      type="button"
      {...props}
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await action();
          if (res.ok) toast.success(res.message ?? 'Saved');
          else toast.error(res.error);
        })
      }
    >
      {children}
    </Button>
  );
}
