'use client';

import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { Markdown } from '@/components/site/markdown';
import { wordCount } from '@/lib/markdown';

type Tool = { label: string; title: string; before: string; after?: string; block?: boolean; placeholder?: string };
const tools: Tool[] = [
  { label: 'H2', title: 'Heading 2', before: '## ', block: true, placeholder: 'Heading' },
  { label: 'H3', title: 'Heading 3', before: '### ', block: true, placeholder: 'Heading' },
  { label: 'B', title: 'Bold', before: '**', after: '**', placeholder: 'bold' },
  { label: 'I', title: 'Italic', before: '_', after: '_', placeholder: 'italic' },
  { label: '“ ”', title: 'Quote', before: '> ', block: true, placeholder: 'Quote' },
  { label: '•', title: 'Bulleted list', before: '- ', block: true, placeholder: 'Item' },
  { label: '1.', title: 'Numbered list', before: '1. ', block: true, placeholder: 'Item' },
  { label: '</>', title: 'Code', before: '`', after: '`', placeholder: 'code' },
  { label: 'Link', title: 'Link', before: '[', after: '](https://)', placeholder: 'text' },
  { label: 'Img', title: 'Image', before: '![', after: '](https://)', placeholder: 'Alt text' },
];

/** Markdown with a small toolbar and Write / Preview tabs (the site renderer). */
export function MarkdownField({
  id,
  label,
  value,
  onChange,
  required,
  error,
  minRows = 10,
  showWords = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  minRows?: number;
  showWords?: boolean;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = React.useState('write');

  const apply = (t: Tool) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || t.placeholder || '';
    const lineStart = t.block ? (s === 0 ? 0 : value.lastIndexOf('\n', s - 1) + 1) : s;
    const next = t.block
      ? `${value.slice(0, lineStart)}${t.before}${value.slice(lineStart, s)}${selected}${value.slice(e)}`
      : `${value.slice(0, s)}${t.before}${selected}${t.after ?? ''}${value.slice(e)}`;
    onChange(next);
    const cursor = (t.block ? lineStart + t.before.length + (s - lineStart) : s + t.before.length) ;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor + selected.length);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-label-sm text-fg">
        {label}
        {required && (
          <span className="text-fg-subtle">
            <span aria-hidden> *</span>
            <span className="sr-only"> (required)</span>
          </span>
        )}
      </label>
      <Tabs.Root value={tab} onValueChange={setTab} className="overflow-hidden rounded-field shadow-field data-invalid:shadow-field-error" data-invalid={error ? '' : undefined}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle bg-surface-2 px-2 py-1.5">
          <div role="toolbar" aria-label={`${label} formatting`} aria-controls={id} className="flex flex-wrap gap-0.5">
            {tools.map((t) => (
              <button
                key={t.title}
                type="button"
                title={t.title}
                aria-label={t.title}
                disabled={tab !== 'write'}
                onClick={() => apply(t)}
                className="grid h-8 min-w-8 cursor-pointer place-items-center rounded-xs px-1.5 type-mono-xs text-fg-muted hover:bg-hover hover:text-fg focus-visible:focus-ring disabled:opacity-40"
              >
                {t.label}
              </button>
            ))}
          </div>
          <Tabs.List aria-label={`${label} mode`} className="flex gap-1">
            {['write', 'preview'].map((v) => (
              <Tabs.Trigger
                key={v}
                value={v}
                className="cursor-pointer rounded-xs px-2.5 py-1 type-label-sm text-fg-muted capitalize hover:text-fg focus-visible:focus-ring data-[state=active]:bg-surface-1 data-[state=active]:text-fg"
              >
                {v}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
        <Tabs.Content value="write" forceMount className="data-[state=inactive]:hidden">
          <textarea
            ref={ref}
            id={id}
            value={value}
            rows={minRows}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="block w-full resize-y bg-field p-4 type-mono-sm text-fg outline-none placeholder:text-fg-subtle"
            placeholder="Write in Markdown…"
          />
        </Tabs.Content>
        <Tabs.Content value="preview" className="max-h-180 overflow-y-auto bg-field p-4 focus-visible:focus-ring">
          {value.trim() ? <Markdown>{value}</Markdown> : <p className="type-body-sm text-fg-subtle">Nothing to preview yet.</p>}
        </Tabs.Content>
      </Tabs.Root>
      {error ? (
        <p id={`${id}-error`} className="type-caption text-fg-danger">
          {error}
        </p>
      ) : showWords ? (
        <p className="type-caption font-normal text-fg-subtle">
          {wordCount(value)} words · about {Math.max(1, Math.round(wordCount(value) / 220))} min read
        </p>
      ) : null}
    </div>
  );
}
