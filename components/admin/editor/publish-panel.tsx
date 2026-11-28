'use client';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { relativeTime } from '@/lib/admin/format';
import { publishLabel, publishStatuses, type PublishStatus } from '@/lib/admin/types';
import { EditorCard } from './layout';
import { SelectField, SwitchField } from './fields';

/** Status, publish date (Dhaka time), featured switch, Save draft and Publish. Figma: Publish card */
export function PublishPanel({
  status,
  onStatus,
  publishAt,
  onPublishAt,
  featured,
  onFeatured,
  featuredLabel = 'Featured on the home page',
  saving,
  savedAt,
  dirty,
  onSave,
  error,
}: {
  status: PublishStatus;
  onStatus: (s: PublishStatus) => void;
  publishAt: string;
  onPublishAt: (v: string) => void;
  featured?: boolean;
  onFeatured?: (v: boolean) => void;
  featuredLabel?: string;
  saving: boolean;
  savedAt: string;
  dirty: boolean;
  onSave: (status?: PublishStatus) => void;
  error?: string;
}) {
  return (
    <EditorCard title="Publish">
      <SelectField id="pub-status" label="Status" value={status} onChange={onStatus} options={publishStatuses.map((s) => ({ value: s, label: publishLabel[s] }))} />
      <Field id="pub-date" label="Publish date" helper="Dhaka time (GMT+6). A scheduled item goes live at this time." error={error}>
        {(a) => <Input {...a} type="datetime-local" value={publishAt} onChange={(e) => onPublishAt(e.target.value)} />}
      </Field>
      {onFeatured && <SwitchField id="pub-featured" label={featuredLabel} checked={!!featured} onChange={onFeatured} />}
      <div className="grid grid-cols-2 gap-3 max-xl:fixed max-xl:inset-x-0 max-xl:bottom-0 max-xl:z-20 max-xl:border-t max-xl:border-line-subtle max-xl:bg-surface-1 max-xl:px-4 max-xl:py-3 lg:max-xl:left-60">
        <Button type="button" variant="secondary" loading={saving} onClick={() => onSave('draft')}>
          Save draft
        </Button>
        <Button type="button" loading={saving} onClick={() => onSave(status === 'draft' ? 'published' : status)}>
          <Check aria-hidden /> {status === 'scheduled' ? 'Schedule' : status === 'published' ? 'Update' : status === 'archived' ? 'Archive' : 'Publish'}
        </Button>
      </div>
      <p className="type-caption font-normal text-fg-subtle" aria-live="polite" suppressHydrationWarning>
        {dirty ? 'Unsaved changes' : savedAt ? `Last saved ${relativeTime(savedAt)}` : 'Not saved yet'}
      </p>
    </EditorCard>
  );
}
