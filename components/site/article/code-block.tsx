'use client';

import * as React from 'react';

import { useFlash } from '@/lib/use-flash';

/** Fenced code with an optional file name and a Copy button. Keyboard-scrollable. */
export function CodeBlock({ title, language, children }: { title?: string; language?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, flash] = useFlash();
  const label = title ?? language ?? 'code';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? '');
      flash();
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <figure className="my-6 overflow-hidden rounded-md border border-line-subtle bg-surface-1">
      <figcaption className="flex items-center justify-between border-b border-line-subtle px-4 py-1.5">
        <span className="type-mono-sm text-fg-subtle">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="inline-flex min-h-7 items-center rounded-sm px-2 type-caption text-fg-muted hover:text-fg focus-visible:focus-ring"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <span role="status" className="sr-only">
          {copied ? 'Code copied to clipboard' : ''}
        </span>
      </figcaption>
      <pre
        ref={ref}
        tabIndex={0}
        aria-label={`${label} code`}
        className="overflow-x-auto p-4 type-mono-sm text-fg focus-visible:focus-ring [&>code]:bg-transparent [&>code]:p-0"
      >
        {children}
      </pre>
    </figure>
  );
}
