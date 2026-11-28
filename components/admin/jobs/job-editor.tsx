'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Check, ExternalLink, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { saveJob } from '@/actions/admin/jobs';
import { ChipsField, ListField, SelectField, SwitchField, TextAreaField, TextField, useUnsavedWarning } from '@/components/admin/editor/fields';
import { EditorCard, EditorColumns } from '@/components/admin/editor/layout';
import { MarkdownField } from '@/components/admin/editor/markdown-field';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Button } from '@/components/ui/button';
import { departmentLabels } from '@/content/careers';
import { relativeTime } from '@/lib/admin/format';
import {
  employmentLabel,
  employmentTypes,
  jobDepartments,
  jobStatuses,
  jobStatusLabel,
  workModeLabel,
  workModes,
  type JobInput,
} from '@/lib/schemas/admin/job';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);

/** Job editor with the Google Jobs panel. Figma: Job Editor 59:7816 */
export function JobEditor({ id, initial, savedAt: initialSavedAt }: { id: string | null; initial: JobInput; savedAt: string }) {
  const router = useRouter();
  const [v, setV] = React.useState(initial);
  const [snapshot, setSnapshot] = React.useState(() => JSON.stringify(initial));
  const [slugTouched, setSlugTouched] = React.useState(!!id);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = React.useState(initialSavedAt);
  const [saving, startSaving] = React.useTransition();
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const dirty = JSON.stringify(v) !== snapshot;
  useUnsavedWarning(dirty);
  const set = <K extends keyof JobInput>(k: K, val: JobInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const today = new Date().toISOString().slice(0, 10);

  const save = (status?: JobInput['status']) =>
    startSaving(async () => {
      const payload = {
        ...v,
        status: status ?? v.status,
        datePosted: (status ?? v.status) === 'open' && !v.datePosted ? today : v.datePosted,
      };
      const res = await saveJob(id, payload);
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setErrors({});
      setV(payload);
      setSnapshot(JSON.stringify(payload));
      setSavedAt(new Date().toISOString());
      toast.success(res.message ?? 'Saved');
      if (!id && res.data) router.replace(`/admin/jobs/${res.data.id}`);
      else router.refresh();
    });

  const errorList = Object.values(errors);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={id ? 'Edit job posting' : 'New job posting'}
        description={`${v.title || 'Untitled role'} · /careers/${v.slug || '…'}`}
        actions={
          id &&
          initial.status === 'open' && (
            <Button asChild variant="secondary">
              <a href={`/careers/${initial.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden /> View on site
              </a>
            </Button>
          )
        }
      />
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="flex items-start gap-2.5 rounded-field bg-status-danger p-4 type-body-sm text-fg-danger outline-none">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="type-label-sm">Fix these before saving:</p>
            <ul className="mt-1 list-disc pl-5">
              {errorList.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <EditorColumns
        main={
          <>
            <EditorCard title="Basic information">
              <TextField
                id="job-title"
                label="Job title"
                required
                value={v.title}
                error={errors.title}
                onChange={(title) => setV((s) => ({ ...s, title, slug: slugTouched ? s.slug : slugify(title) }))}
                placeholder="Senior Frontend Engineer (React / Tailwind)"
              />
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField id="job-dept" label="Department" required value={v.department} onChange={(x) => set('department', x)} options={jobDepartments.map((d) => ({ value: d, label: departmentLabels[d] ?? d }))} />
                <SelectField id="job-type" label="Employment type" required value={v.employmentType} onChange={(x) => set('employmentType', x)} options={employmentTypes.map((t) => ({ value: t, label: employmentLabel[t] }))} />
                <SelectField id="job-mode" label="Work mode" required value={v.workMode} onChange={(x) => set('workMode', x)} options={workModes.map((m) => ({ value: m, label: workModeLabel[m] }))} />
              </div>
              {v.workMode === 'remote' ? (
                <ChipsField
                  id="job-countries"
                  label="Applicant countries"
                  value={v.applicantCountries}
                  onChange={(x) => set('applicantCountries', x.map((c) => c.toUpperCase()))}
                  placeholder="BD, IN"
                  helper={errors.applicantCountries ?? 'Two-letter codes. Google needs them for remote roles.'}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField id="job-city" label="City" required value={v.locationCity} onChange={(x) => set('locationCity', x)} error={errors.locationCity} placeholder="Barishal" />
                  <TextField id="job-country" label="Country" required value={v.locationCountry} onChange={(x) => set('locationCountry', x)} placeholder="Bangladesh" />
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-4">
                <TextField id="job-min" label="Salary min" inputMode="numeric" value={v.salaryMin} onChange={(x) => set('salaryMin', x)} error={errors.salaryMin} />
                <TextField id="job-max" label="Salary max" inputMode="numeric" value={v.salaryMax} onChange={(x) => set('salaryMax', x)} error={errors.salaryMax} />
                <SelectField id="job-cur" label="Currency" value={v.salaryCurrency} onChange={(x) => set('salaryCurrency', x)} options={[{ value: 'BDT', label: 'BDT (৳)' }, { value: 'USD', label: 'USD ($)' }]} />
                <SelectField id="job-unit" label="Per" value={v.salaryUnit} onChange={(x) => set('salaryUnit', x)} options={[{ value: 'MONTH', label: 'Month' }, { value: 'YEAR', label: 'Year' }]} />
              </div>
              <TextAreaField id="job-summary" label="Summary" rows={2} value={v.summary} onChange={(x) => set('summary', x)} max={200} helper="Shown in the role list and search results" />
            </EditorCard>
            <EditorCard title="Description">
              <MarkdownField id="job-description" label="Role description (Markdown)" required value={v.description} onChange={(x) => set('description', x)} minRows={10} error={errors.description} />
            </EditorCard>
            <EditorCard title="Responsibilities" description="Shown as a checklist on the job page.">
              <ListField id="job-resp" label="Responsibilities" value={v.responsibilities} onChange={(x) => set('responsibilities', x)} placeholder="Drive frontend architecture decisions" />
            </EditorCard>
            <EditorCard title="Requirements">
              <ListField id="job-req" label="Requirements" value={v.requirements} onChange={(x) => set('requirements', x)} placeholder="5+ years building complex React apps" />
            </EditorCard>
          </>
        }
        side={
          <>
            <EditorCard title="Publish">
              <SelectField id="job-status" label="Status" value={v.status} onChange={(x) => set('status', x)} options={jobStatuses.map((s) => ({ value: s, label: jobStatusLabel[s] }))} />
              <SwitchField id="job-accepting" label="Accept applications" checked={v.acceptingApplications} onChange={(x) => set('acceptingApplications', x)} />
              <div className="grid grid-cols-2 gap-3 max-xl:fixed max-xl:inset-x-0 max-xl:bottom-0 max-xl:z-20 max-xl:border-t max-xl:border-line-subtle max-xl:bg-surface-1 max-xl:px-4 max-xl:py-3 lg:max-xl:left-60">
                <Button type="button" variant="secondary" loading={saving} onClick={() => save('draft')}>
                  Save draft
                </Button>
                <Button type="button" loading={saving} onClick={() => save(v.status === 'closed' ? 'closed' : 'open')}>
                  <Check aria-hidden /> {v.status === 'open' ? 'Update' : v.status === 'closed' ? 'Save' : 'Publish'}
                </Button>
              </div>
              <p className="type-caption font-normal text-fg-subtle" aria-live="polite">
                {dirty ? 'Unsaved changes' : savedAt ? `Last saved ${relativeTime(savedAt)}` : 'Not saved yet'}
              </p>
            </EditorCard>
            <EditorCard title="Google Jobs" description="Required for the JobPosting rich result.">
              <TextField id="job-posted" label="Date posted" required type="date" value={v.datePosted} onChange={(x) => set('datePosted', x)} error={errors.datePosted} />
              <TextField id="job-valid" label="Valid through" required type="date" value={v.validThrough} onChange={(x) => set('validThrough', x)} error={errors.validThrough} helper="The role closes itself after this date" />
              <TextField
                id="job-slug"
                label="URL slug"
                required
                value={v.slug}
                error={errors.slug}
                onChange={(x) => {
                  setSlugTouched(true);
                  set('slug', x.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-'));
                }}
                helper={`/careers/${v.slug || '…'}`}
              />
              <SwitchField id="job-remote" label="Remote role (TELECOMMUTE)" checked={v.workMode === 'remote'} onChange={(on) => set('workMode', on ? 'remote' : 'onsite')} />
            </EditorCard>
          </>
        }
      />
    </div>
  );
}
