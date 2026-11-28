'use client';

import * as React from 'react';

/** Fenced code with an optional file name and a Copy button. */
export function CodeBlock({ title, language, children }: { title?: string; language?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <figure className="my-6 overflow-hidden rounded-md border border-line-subtle bg-surface-1">
      <figcaption className="flex items-center justify-between border-b border-line-subtle px-4 py-2">
        <span className="type-mono-sm text-fg-subtle">{title ?? language ?? 'code'}</span>
        <button type="button" onClick={copy} className="rounded-sm px-1.5 type-caption text-fg-muted hover:text-fg focus-visible:focus-ring">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre ref={ref} className="overflow-x-auto p-4 type-mono-sm text-fg [&>code]:bg-transparent [&>code]:p-0">
        {children}
      </pre>
    </figure>
  );
}
