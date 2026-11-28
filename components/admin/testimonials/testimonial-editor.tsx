'use client';

import { Check } from 'lucide-react';

import { saveTestimonial } from '@/actions/admin/testimonials';
import { SelectField, SwitchField, TextAreaField, TextField } from '@/components/admin/editor/fields';
import { EditorCard, EditorColumns } from '@/components/admin/editor/layout';
import { MediaField } from '@/components/admin/editor/media-field';
import { ErrorSummary, useEditor } from '@/components/admin/editor/use-editor';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Button } from '@/components/ui/button';
import { services } from '@/content/services';
import { relativeTime } from '@/lib/admin/format';
import { publishLabel, publishStatuses } from '@/lib/admin/types';
import { youtubeId, type TestimonialInput } from '@/lib/schemas/admin/testimonial';

/** Testimonial editor: text or video. Figma: Testimonial Editor 59:6529 */
export function TestimonialEditor({
  id,
  initial,
  savedAt,
  caseStudies,
}: {
  id: string | null;
  initial: TestimonialInput;
  savedAt: string;
  caseStudies: { id: string; label: string }[];
}) {
  const e = useEditor({ id, initial, savedAt, base: '/admin/testimonials', action: saveTestimonial });
  const v = e.value;
  const video = v.type === 'video';
  const vid = youtubeId(v.videoUrl);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={id ? 'Edit testimonial' : 'New testimonial'} description={v.clientName ? `${v.clientName}${v.company ? `, ${v.company}` : ''}` : 'Client quote for the home page'} />
      <ErrorSummary errors={e.errors} summaryRef={e.summaryRef} />
      <EditorColumns
        main={
          <>
            <EditorCard title="Testimonial">
              <fieldset>
                <legend className="mb-2 type-label-sm text-fg">Type</legend>
                <div className="inline-flex rounded-field bg-surface-2 p-1">
                  {(['text', 'video'] as const).map((t) => (
                    <label key={t} className="cursor-pointer rounded-button-sm px-4 py-1.5 type-label-sm text-fg-muted capitalize has-checked:bg-surface-1 has-checked:text-fg has-focus-visible:focus-ring">
                      <input type="radio" name="tm-type" value={t} checked={v.type === t} onChange={() => e.set('type', t)} className="sr-only" />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 md:grid-cols-3">
                <TextField id="tm-name" label="Client name" required value={v.clientName} onChange={(x) => e.set('clientName', x)} error={e.errors.clientName} />
                <TextField id="tm-role" label="Role" value={v.role} onChange={(x) => e.set('role', x)} placeholder="Founder" />
                <TextField id="tm-company" label="Company" required value={v.company} onChange={(x) => e.set('company', x)} error={e.errors.company} />
              </div>
              <TextAreaField id="tm-quote" label="Quote" required rows={4} value={v.quote} onChange={(x) => e.set('quote', x)} max={280} error={e.errors.quote} helper="Their words, lightly edited only with permission" />
              <MediaField id="tm-avatar" label="Photo" value={v.avatar} onChange={(x) => e.set('avatar', x)} error={e.errors.avatar} />
            </EditorCard>
            {video && (
              <EditorCard title="Video" description="The video loads only when a visitor presses play.">
                <TextField id="tm-video" label="YouTube link" required value={v.videoUrl} onChange={(x) => e.set('videoUrl', x)} error={e.errors.videoUrl} helper={vid ? `Video id ${vid}` : 'https://youtu.be/…'} />
                <TextField id="tm-duration" label="Duration" value={v.duration} onChange={(x) => e.set('duration', x)} error={e.errors.duration} placeholder="2:14" />
                <MediaField id="tm-poster" label="Poster image" required value={v.poster} onChange={(x) => e.set('poster', x)} error={e.errors.poster} />
              </EditorCard>
            )}
          </>
        }
        side={
          <>
            <EditorCard title="Publish">
              <SelectField id="tm-status" label="Status" value={v.status} onChange={(x) => e.set('status', x)} options={publishStatuses.filter((s) => s !== 'scheduled').map((s) => ({ value: s, label: publishLabel[s] }))} />
              <SwitchField id="tm-featured" label="Show first on the home page" checked={v.isFeatured} onChange={(x) => e.set('isFeatured', x)} />
              <SwitchField id="tm-consent" label="The client agreed to be quoted" helper="Required to publish" checked={v.consent} onChange={(x) => e.set('consent', x)} />
              {e.errors.consent && <p className="type-caption text-fg-danger">{e.errors.consent}</p>}
              <div className="grid grid-cols-2 gap-3 max-xl:fixed max-xl:inset-x-0 max-xl:bottom-0 max-xl:z-20 max-xl:border-t max-xl:border-line-subtle max-xl:bg-surface-1 max-xl:px-4 max-xl:py-3 lg:max-xl:left-60">
                <Button type="button" variant="secondary" loading={e.saving} onClick={() => e.save({ status: 'draft' })}>
                  Save draft
                </Button>
                <Button type="button" loading={e.saving} onClick={() => e.save({ status: v.status === 'archived' ? 'archived' : 'published' })}>
                  <Check aria-hidden /> {v.status === 'published' ? 'Update' : v.status === 'archived' ? 'Archive' : 'Publish'}
                </Button>
              </div>
              <p className="type-caption font-normal text-fg-subtle" aria-live="polite" suppressHydrationWarning>
                {e.dirty ? 'Unsaved changes' : e.savedAt ? `Last saved ${relativeTime(e.savedAt)}` : 'Not saved yet'}
              </p>
            </EditorCard>
            <EditorCard title="Links">
              <SelectField id="tm-case" label="Case study" value={v.caseStudyId} onChange={(x) => e.set('caseStudyId', x)} options={[{ value: '', label: 'None' }, ...caseStudies.map((c) => ({ value: c.id, label: c.label }))]} />
              <SelectField id="tm-service" label="Service" value={v.service} onChange={(x) => e.set('service', x)} options={[{ value: '' as const, label: 'None' }, ...services.map((s) => ({ value: s.slug, label: s.title }))]} />
            </EditorCard>
          </>
        }
      />
    </div>
  );
}
