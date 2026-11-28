'use client';

import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { ActionResult } from '@/lib/admin/action';

/**
 * Delete through the Confirm Dialog and a server action, then a toast.
 * The trigger is an icon button unless `trigger` is given.
 */
export function ConfirmDelete({
  title,
  description,
  action,
  label,
  trigger,
  onDone,
}: {
  title: string;
  description: React.ReactNode;
  action: () => Promise<ActionResult>;
  label: string;
  trigger?: React.ReactNode;
  onDone?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  return (
    <AlertDialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label={label}
            title={label}
            className="grid size-9 cursor-pointer place-items-center rounded-button-sm text-icon hover:bg-status-danger hover:text-fg-danger focus-visible:focus-ring"
          >
            <Trash2 className="size-4.5" aria-hidden />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant="danger"
            loading={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await action();
                if (res.ok) {
                  toast.success(res.message ?? 'Deleted');
                  setOpen(false);
                  onDone?.();
                } else toast.error(res.error);
              })
            }
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
