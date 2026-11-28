'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { initials } from '@/lib/admin/format';

/**
 * Slide-over for one record, opened by `?id=` so it can be linked and the
 * back button closes it. Figma: Contact Inquiries drawer 55:3991
 */
export function RecordDrawer({
  closeHref,
  name,
  meta,
  children,
  footer,
}: {
  closeHref: string;
  name: string;
  meta: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Sheet open onOpenChange={(open) => !open && router.replace(closeHref, { scroll: false })}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:w-120">
        <div className="flex items-center gap-3 border-b border-line-subtle px-6 py-5 pr-14">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-3 type-label text-fg-muted">
            {initials(name)}
          </span>
          <div className="min-w-0">
            <SheetTitle className="truncate type-h4">{name}</SheetTitle>
            <SheetDescription className="truncate type-caption">{meta}</SheetDescription>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="grid grid-cols-2 gap-3 border-t border-line-subtle px-6 py-4">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
}

/** Two-by-two facts grid of the drawer. */
export function FactGrid({ facts }: { facts: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-field border border-line-subtle">
      {facts.map((f, i) => (
        <div key={f.label} className={`flex flex-col gap-1 p-3.5 ${i % 2 === 0 ? 'border-r' : ''} ${i < facts.length - 2 ? 'border-b' : ''} border-line-subtle`}>
          <dt className="type-caption font-normal text-fg-subtle">{f.label}</dt>
          <dd className="type-label-sm text-fg">{f.value || 'Not given'}</dd>
        </div>
      ))}
    </dl>
  );
}
