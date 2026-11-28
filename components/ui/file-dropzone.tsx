'use client';

import * as React from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type DropzoneFile = { name: string; size: number };

type Props = {
  /** id of the file input; the Field label points at it */
  id: string;
  accept: string;
  /** Files picked or dropped (already capped to the free slots). */
  onFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
  files: DropzoneFile[];
  /** Maximum number of files (1 for a single file). */
  max?: number;
  /** The file being uploaded now, with progress 0 to 100. */
  uploading?: { name: string; progress: number } | null;
  hint: string;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
};

const formatSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

/**
 * File drop zone. The real file input stays mounted (sr-only, keyboard
 * reachable, labelled by the Field), the zone accepts drag and drop, and a
 * polite status line announces start, finish and removal, not every progress
 * tick. Figma: File Dropzone 13:2669 (Empty, Dragover, Uploaded)
 */
export function FileDropzone({
  id,
  accept,
  onFiles,
  onRemove,
  files,
  max = 1,
  uploading,
  hint,
  invalid,
  describedBy,
  disabled,
}: Props) {
  const [over, setOver] = React.useState(false);
  const [announce, setAnnounce] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const prev = React.useRef({ count: files.length, uploading: uploading?.name });
  const full = files.length >= max;
  const busy = !!uploading || !!disabled;

  React.useEffect(() => {
    const was = prev.current;
    if (uploading?.name && uploading.name !== was.uploading) setAnnounce(`Uploading ${uploading.name}`);
    else if (!uploading && was.uploading && files.length > was.count) setAnnounce(`${was.uploading} uploaded`);
    prev.current = { count: files.length, uploading: uploading?.name };
  }, [uploading, files.length]);

  const take = (list: FileList | null) => {
    if (!list || busy) return;
    const picked = Array.from(list).slice(0, Math.max(0, max - files.length));
    if (picked.length) onFiles(picked);
  };

  return (
    <div className="flex flex-col gap-2">
      {files.map((f, i) => (
        <div key={`${f.name}-${i}`} className={cn('flex items-center gap-3 rounded-field bg-field p-3 shadow-field', invalid && 'shadow-field-error')}>
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-brand-soft text-icon-brand">
            <FileText className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate type-label-sm text-fg">{f.name}</p>
            <p className="type-caption font-normal text-fg-subtle">{formatSize(f.size)} · Uploaded</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onRemove(i);
              setAnnounce(`${f.name} removed`);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            disabled={busy}
            aria-label={`Remove ${f.name}`}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-sm text-icon hover:bg-hover hover:text-fg focus-visible:focus-ring disabled:opacity-50"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}

      {uploading && (
        <div className="flex items-center gap-3 rounded-field bg-field p-3 shadow-field">
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-brand-soft text-icon-brand">
            <Loader2 className="size-5 motion-safe:animate-spin" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate type-label-sm text-fg">{uploading.name}</p>
            <div
              className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2"
              role="progressbar"
              aria-valuenow={uploading.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Uploading ${uploading.name}`}
            >
              <div className="h-full bg-action-primary transition-[width]" style={{ width: `${uploading.progress}%` }} />
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => !busy && !full && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy && !full) setOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-field border border-dashed px-6 py-8 text-center transition-colors has-[input:focus-visible]:focus-ring',
          over ? 'border-line-brand bg-brand-soft' : 'border-line hover:border-line-brand',
          invalid && 'border-fg-danger',
          (busy || full) && 'cursor-default opacity-50 hover:border-line',
          full && files.length > 0 && 'sr-only'
        )}
      >
        <span aria-hidden className="grid size-9 place-items-center rounded-full bg-brand-soft text-icon-brand">
          <Upload className="size-4" />
        </span>
        <span aria-hidden className="type-label-sm text-fg">
          Drag &amp; drop or <span className="text-fg-brand underline underline-offset-4">browse files</span>
        </span>
        <span aria-hidden className="type-caption font-normal text-fg-subtle">
          {hint}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={max > 1}
          className="sr-only"
          disabled={busy || full}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            take(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      <p role="status" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
