'use client';

import * as React from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type DropzoneFile = { name: string; size: number };

type Props = {
  id: string;
  accept: string;
  /** Called with the chosen file; return a promise to show progress until it settles. */
  onFile: (file: File) => void;
  onRemove: () => void;
  file: DropzoneFile | null;
  progress?: number | null;
  uploading?: boolean;
  hint: string;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
};

const formatSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

/**
 * File drop zone with a real (sr-only, not display:none) file input, so it is
 * keyboard reachable. Shows name, size, upload progress and a remove button.
 * Figma: File Dropzone 13:2669 (Empty, Dragover, Uploaded)
 */
export function FileDropzone({ id, accept, onFile, onRemove, file, progress, uploading, hint, invalid, describedBy, disabled }: Props) {
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (file) {
    return (
      <div className={cn('flex items-center gap-3 rounded-field bg-field p-3 shadow-field', invalid && 'shadow-field-error')}>
        <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-brand-soft text-icon-brand">
          {uploading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <FileText className="size-5" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate type-label-sm text-fg">{file.name}</p>
          <p className="type-caption font-normal text-fg-subtle">
            {formatSize(file.size)}
            {uploading && typeof progress === 'number' && ` · Uploading ${progress}%`}
            {!uploading && ' · Uploaded'}
          </p>
          {uploading && typeof progress === 'number' && (
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
              <div className="h-full bg-action-primary transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            onRemove();
            if (inputRef.current) inputRef.current.value = '';
          }}
          disabled={uploading || disabled}
          aria-label={`Remove ${file.name}`}
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-sm text-icon hover:bg-hover hover:text-fg focus-visible:focus-ring disabled:opacity-50"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f && !disabled) onFile(f);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-2 rounded-field border border-dashed px-6 py-8 text-center transition-colors has-[input:focus-visible]:focus-ring',
        over ? 'border-line-brand bg-brand-soft' : 'border-line hover:border-line-brand',
        invalid && 'border-fg-danger',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-icon-brand">
        <Upload className="size-4" aria-hidden />
      </span>
      <span className="type-label-sm text-fg">
        Drag &amp; drop or <span className="text-fg-brand underline underline-offset-4">browse files</span>
      </span>
      <span className="type-caption font-normal text-fg-subtle">{hint}</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}
