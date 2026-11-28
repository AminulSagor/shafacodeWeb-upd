'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { deleteMedia, updateMediaAlt } from '@/actions/admin/media';
import { uploadImage } from '@/components/admin/editor/upload-image';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/** Upload button for the library (signed upload to the media bucket). */
export function MediaUpload() {
  const router = useRouter();
  const ref = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState('');
  return (
    <>
      <Button type="button" onClick={() => ref.current?.click()} loading={!!status}>
        <Upload aria-hidden /> Upload images
      </Button>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = '';
          for (const f of files) {
            setStatus(`Uploading ${f.name}`);
            try {
              await uploadImage(f, '', (p) => setStatus(`Uploading ${f.name} ${p}%`));
              toast.success(`${f.name} uploaded. Add its alt text.`);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Upload failed.');
            }
          }
          setStatus('');
          router.refresh();
        }}
      />
      <span role="status" className="sr-only">
        {status}
      </span>
    </>
  );
}

/** Detail panel: alt text, URL copy, usage and delete. */
export function MediaDetail({ id, url, alt, used, closeHref }: { id: string; url: string; alt: string; used: string[]; closeHref: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(alt);
  const [pending, start] = React.useTransition();
  const absolute = url.startsWith('/') && typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await updateMediaAlt(id, value);
            if (res.ok) toast.success('Alt text saved');
            else toast.error(res.error);
          });
        }}
      >
        <label htmlFor="media-alt" className="type-label-sm text-fg">
          Alt text
        </label>
        <Input id="media-alt" value={value} maxLength={250} onChange={(e) => setValue(e.target.value)} placeholder="Describe what the image shows" />
        <p className="type-caption font-normal text-fg-subtle">Used as the default when the image is picked. Leave empty only for decoration.</p>
        <Button type="submit" variant="secondary" size="sm" className="self-start" loading={pending} disabled={value === alt}>
          Save alt text
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(absolute);
            toast.success('Image URL copied');
          } catch {
            toast.error('Copy failed. Select the URL instead.');
          }
        }}
      >
        <Copy aria-hidden /> Copy URL
      </Button>
      <div>
        <p className="type-label-sm text-fg">Used in</p>
        {used.length ? (
          <ul className="mt-1.5 flex flex-col gap-1 type-body-sm text-fg-muted">
            {used.map((u) => (
              <li key={u}>{u.replace(':', ' · ')}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 type-body-sm text-fg-subtle">Not used anywhere.</p>
        )}
      </div>
      <ConfirmDelete
        label="Delete image"
        title="Delete this image?"
        description={used.length ? 'This image is still used. Replace it in those items first.' : 'The image is removed from the library and storage for good.'}
        action={deleteMedia.bind(null, id)}
        onDone={() => router.replace(closeHref)}
        trigger={
          <Button type="button" variant="secondary" size="sm" className="self-start text-fg-danger">
            Delete image
          </Button>
        }
      />
    </div>
  );
}
