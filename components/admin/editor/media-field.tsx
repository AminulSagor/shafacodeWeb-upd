'use client';

import * as React from 'react';
import { Check, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { pickerMedia } from '@/actions/admin/media';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { MediaItem } from '@/lib/admin/media';
import { publicMediaUrl } from '@/lib/media';
import { uploadImage } from './upload-image';

export type MediaRef = { path: string; alt: string; width: number; height: number };

const toRef = (m: MediaItem): MediaRef => ({ path: m.path, alt: m.alt, width: m.width, height: m.height });
const src = (path: string) => (path.startsWith('/') ? path : publicMediaUrl(path));

/** Library grid with upload; returns the chosen images. */
function MediaPicker({ open, onOpenChange, onPick, multiple = false }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (m: MediaRef[]) => void; multiple?: boolean }) {
  const [items, setItems] = React.useState<MediaItem[] | null>(null);
  const [chosen, setChosen] = React.useState<string[]>([]);
  const [upload, setUpload] = React.useState<{ name: string; progress: number } | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    let alive = true;
    pickerMedia()
      .then((list) => alive && setItems(list))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [open]);

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : multiple ? [...c, id] : [id]));

  const onFiles = async (files: FileList | null) => {
    for (const file of Array.from(files ?? [])) {
      setUpload({ name: file.name, progress: 0 });
      try {
        const item = await uploadImage(file, '', (p) => setUpload({ name: file.name, progress: p }));
        setItems((list) => [item, ...(list ?? [])]);
        setChosen((c) => (multiple ? [...c, item.id] : [item.id]));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Upload failed.');
      } finally {
        setUpload(null);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setChosen([]);
      }}
    >
      <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-180">
        <DialogTitle>Media library</DialogTitle>
        <DialogDescription>Pick {multiple ? 'images' : 'an image'} or upload a PNG, JPG or WebP up to 8 MB.</DialogDescription>
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={!!upload}>
            <Upload aria-hidden /> Upload
          </Button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple={multiple} className="sr-only" tabIndex={-1} onChange={(e) => onFiles(e.target.files)} />
          <p className="type-caption font-normal text-fg-subtle" role="status">
            {upload ? `Uploading ${upload.name}… ${upload.progress}%` : `${chosen.length} selected`}
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {items === null ? (
            <p className="flex items-center gap-2 py-10 type-body-sm text-fg-subtle">
              <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden /> Loading images…
            </p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center type-body-sm text-fg-subtle">No images yet. Upload the first one.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((m) => {
                const on = chosen.includes(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(m.id)}
                      className={cn(
                        'relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-field border-2 focus-visible:focus-ring',
                        on ? 'border-action-primary-border' : 'border-transparent'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails from the media bucket */}
                      <img src={m.url} alt={m.alt || 'Image without alt text'} className="size-full object-cover" loading="lazy" />
                      {on && (
                        <span className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-action-primary text-fg-on-brand">
                          <Check className="size-3.5" strokeWidth={3} aria-hidden />
                        </span>
                      )}
                      {!m.alt && <span className="absolute bottom-1.5 left-1.5 rounded-xs bg-status-warning px-1.5 type-caption text-fg-warning">No alt</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-line-subtle pt-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!chosen.length}
            onClick={() => {
              const map = new Map((items ?? []).map((m) => [m.id, m]));
              onPick(chosen.map((id) => map.get(id)).filter((m): m is MediaItem => !!m).map(toRef));
              onOpenChange(false);
              setChosen([]);
            }}
          >
            Use {multiple && chosen.length > 1 ? `${chosen.length} images` : 'image'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** One image with required alt text (covers, posters, photos). */
export function MediaField({
  id,
  label,
  value,
  onChange,
  required,
  error,
}: {
  id: string;
  label: string;
  value: MediaRef | null;
  onChange: (v: MediaRef | null) => void;
  required?: boolean;
  error?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-3">
      <p className="type-label-sm text-fg">
        {label}
        {required && <span className="text-fg-subtle"> *</span>}
      </p>
      {value ? (
        <div className="grid gap-4 sm:grid-cols-[--spacing(62)_minmax(0,1fr)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
          <img src={src(value.path)} alt="" className="aspect-4/3 w-full rounded-field object-cover" />
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-alt`} className="type-label-sm text-fg">
              Alt text <span className="text-fg-subtle">*</span>
            </label>
            <Input
              id={`${id}-alt`}
              value={value.alt}
              maxLength={250}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              placeholder="Describe what the image shows"
            />
            {error && (
              <p id={`${id}-error`} className="type-caption text-fg-danger">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
                <ImageIcon aria-hidden /> Replace image
              </Button>
              {!required && (
                <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                  <X aria-hidden /> Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            id={id}
            onClick={() => setOpen(true)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-2 rounded-field border border-dashed px-6 py-8 text-center hover:border-line-brand focus-visible:focus-ring',
              error ? 'border-fg-danger' : 'border-line'
            )}
          >
            <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-icon-brand">
              <ImageIcon className="size-4" aria-hidden />
            </span>
            <span className="type-label-sm text-fg">Choose or upload an image</span>
            <span className="type-caption font-normal text-fg-subtle">PNG, JPG or WebP, up to 8 MB</span>
          </button>
          {error && (
            <p id={`${id}-error`} className="type-caption text-fg-danger">
              {error}
            </p>
          )}
        </>
      )}
      <MediaPicker open={open} onOpenChange={setOpen} onPick={([m]) => m && onChange(m)} />
    </div>
  );
}

/** Several images, each with alt text, removable and in order. */
export function GalleryField({ value, onChange, max = 8, error }: { value: MediaRef[]; onChange: (v: MediaRef[]) => void; max?: number; error?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-3">
      <p className="type-label-sm text-fg">Gallery (up to {max} images)</p>
      {value.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {value.map((m, i) => (
            <li key={`${m.path}-${i}`} className="flex gap-3 rounded-field border border-line-subtle p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
              <img src={src(m.path)} alt="" className="size-18 shrink-0 rounded-xs object-cover" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Input aria-label={`Alt text for image ${i + 1}`} value={m.alt} maxLength={250} placeholder="Alt text" onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="w-fit cursor-pointer rounded-sm type-caption text-fg-danger hover:underline focus-visible:focus-ring"
                >
                  Remove image {i + 1}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="type-caption text-fg-danger">{error}</p>}
      {value.length < max && (
        <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => setOpen(true)}>
          <ImageIcon aria-hidden /> Add images
        </Button>
      )}
      <MediaPicker open={open} multiple onOpenChange={setOpen} onPick={(list) => onChange([...value, ...list].slice(0, max))} />
    </div>
  );
}
