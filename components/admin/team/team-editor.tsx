'use client';

import { Check } from 'lucide-react';

import { saveTeamMember } from '@/actions/admin/team';
import { SwitchField, TextAreaField, TextField } from '@/components/admin/editor/fields';
import { EditorCard, EditorColumns } from '@/components/admin/editor/layout';
import { MediaField } from '@/components/admin/editor/media-field';
import { ErrorSummary, useEditor } from '@/components/admin/editor/use-editor';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Button } from '@/components/ui/button';
import { relativeTime } from '@/lib/admin/format';
import type { TeamInput } from '@/lib/schemas/admin/team';

/** Team member editor. Figma: Team Member Editor 61:9235 */
export function TeamEditor({ id, initial, savedAt }: { id: string | null; initial: TeamInput; savedAt: string }) {
  const e = useEditor({ id, initial, savedAt, base: '/admin/team', action: saveTeamMember });
  const v = e.value;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={id ? 'Edit team member' : 'New team member'} description={v.name ? `${v.name}${v.role ? `, ${v.role}` : ''}` : 'Shown on the About page'} />
      <ErrorSummary errors={e.errors} summaryRef={e.summaryRef} />
      <EditorColumns
        main={
          <EditorCard title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="tm-name" label="Name" required value={v.name} onChange={(x) => e.set('name', x)} error={e.errors.name} />
              <TextField id="tm-role" label="Role" required value={v.role} onChange={(x) => e.set('role', x)} error={e.errors.role} placeholder="Lead Developer" />
              <TextField id="tm-dept" label="Department" value={v.department} onChange={(x) => e.set('department', x)} placeholder="Engineering" />
              <TextField id="tm-location" label="Location" value={v.location} onChange={(x) => e.set('location', x)} placeholder="Barishal, Bangladesh" />
            </div>
            <TextAreaField id="tm-bio" label="Short bio" rows={3} value={v.bio} onChange={(x) => e.set('bio', x)} max={200} error={e.errors.bio} />
            <MediaField id="tm-photo" label="Photo" value={v.photo} onChange={(x) => e.set('photo', x)} error={e.errors.photo} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="tm-linkedin" label="LinkedIn" optional type="url" value={v.linkedinUrl} onChange={(x) => e.set('linkedinUrl', x)} error={e.errors.linkedinUrl} placeholder="https://www.linkedin.com/in/…" />
              <TextField id="tm-portfolio" label="Portfolio" optional type="url" value={v.portfolioUrl} onChange={(x) => e.set('portfolioUrl', x)} error={e.errors.portfolioUrl} placeholder="https://" />
            </div>
          </EditorCard>
        }
        side={
          <EditorCard title="Visibility">
            <SwitchField id="tm-visible" label="Show on the About page" checked={v.visible} onChange={(x) => e.set('visible', x)} />
            <SwitchField id="tm-author" label="Can be a blog author" checked={v.isAuthor} onChange={(x) => e.set('isAuthor', x)} />
            <div className="max-xl:fixed max-xl:inset-x-0 max-xl:bottom-0 max-xl:z-20 max-xl:border-t max-xl:border-line-subtle max-xl:bg-surface-1 max-xl:px-4 max-xl:py-3 lg:max-xl:left-60">
              <Button type="button" className="w-full" loading={e.saving} onClick={() => e.save()}>
                <Check aria-hidden /> Save
              </Button>
            </div>
            <p className="type-caption font-normal text-fg-subtle" aria-live="polite">
              {e.dirty ? 'Unsaved changes' : e.savedAt ? `Last saved ${relativeTime(e.savedAt)}` : 'Not saved yet'}
            </p>
          </EditorCard>
        }
      />
    </div>
  );
}
