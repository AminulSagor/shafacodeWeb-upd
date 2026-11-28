'use client';

import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/** sonner, themed with tokens. Success toasts are success-styled. Figma: Toast 14:2536 */
function Toaster({ theme = 'dark', ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      icons={{
        success: <CircleCheck className="size-4 text-fg-success" />,
        info: <Info className="size-4 text-fg-info" />,
        warning: <TriangleAlert className="size-4 text-fg-warning" />,
        error: <OctagonX className="size-4 text-fg-danger" />,
        loading: <Loader2 className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'squircle !rounded-[var(--field-radius)] !border !border-line !bg-surface-1 !text-fg !font-sans',
          description: '!text-fg-muted',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
