'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { saveCaseStudy } from '@/actions/admin/case-studies';
import { ChipsField, PairsField, SelectField, TextAreaField, TextField, useUnsavedWarning } from '@/components/admin/editor/fields';
import { EditorCard, EditorColumns } from '@/components/admin/editor/layout';
import { MarkdownField } from '@/components/admin/editor/markdown-field';
import { GalleryField, MediaField } from '@/components/admin/editor/media-field';
import { PublishPanel } from '@/components/admin/editor/publish-panel';
import { SeoPanel } from '@/components/admin/editor/seo-panel';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { services } from '@/content/services';
import type { PublishStatus } from '@/lib/admin/types';
import type { CaseStudyInput } from '@/lib/schemas/admin/case-study';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);

export const emptyCaseStudy: CaseStudyInput = {
  title: '',
  client: '',
  industry: '',
  deliveryStatus: 'delivered',
  summary: '',
  services: [],
  techStack: [],
  timeline: '',
  liveUrl: '',
  contactEmail: '',
  challenge: '',
  solution: '',
  results: [],
  cover: null,
  gallery: [],
  slug: '',
  seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', noIndex: false },
  status: 'draft',
  isFeatured: false,
  publishAt: '',
};

/** Two-column case study editor. Figma: Case Study Editor 57:5032 (mobile 62:10597) */
export function CaseStudyEditor({ id, initial, savedAt: initialSavedAt }: { id: string | null; initial: CaseStudyInput; savedAt: string }) {
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

  const set = <K extends keyof CaseStudyInput>(k: K, val: CaseStudyInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const setTitle = (title: string) => setV((s) => ({ ...s, title, slug: slugTouched ? s.slug : slugify(s.client || title) }));
  const setClient = (client: string) => setV((s) => ({ ...s, client, slug: slugTouched ? s.slug : slugify(client || s.title) }));

  const save = (status?: PublishStatus) =>
    startSaving(async () => {
      const payload = { ...v, status: status ?? v.status };
      const res = await saveCaseStudy(id, payload);
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
      if (!id && res.data) router.replace(`/admin/case-studies/${res.data.id}`);
      else router.refresh();
    });

  const errorList = Object.values(errors);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={id ? 'Edit case study' : 'New case study'}
        description={`${v.client || 'Untitled'} · /portfolio/${v.slug || '…'}`}
        actions={
          id &&
          initial.status === 'published' && (
            <Button asChild variant="secondary">
              <a href={`/portfolio/${initial.slug}`} target="_blank" rel="noopener noreferrer">
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
              <TextField id="cs-title" label="Project title" required value={v.title} onChange={setTitle} error={errors.title} placeholder="Texas Airway Institute: website and admin dashboard" />
              <div className="grid gap-4 md:grid-cols-3">
                <TextField id="cs-client" label="Client" required value={v.client} onChange={setClient} error={errors.client} />
                <TextField id="cs-industry" label="Industry" value={v.industry} onChange={(x) => set('industry', x)} placeholder="Medical education" />
                <SelectField
                  id="cs-delivery"
                  label="Project status"
                  value={v.deliveryStatus}
                  onChange={(x) => set('deliveryStatus', x)}
                  options={[
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'in-progress', label: 'In progress' },
                  ]}
                />
              </div>
              <TextAreaField id="cs-summary" label="Short summary" required rows={3} value={v.summary} onChange={(x) => set('summary', x)} max={160} helper="Shown on cards" error={errors.summary} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField id="cs-timeline" label="Timeline" value={v.timeline} onChange={(x) => set('timeline', x)} placeholder="10 weeks" />
                <TextField id="cs-contact" label="Client contact email" optional type="email" value={v.contactEmail} onChange={(x) => set('contactEmail', x)} error={errors.contactEmail} helper="Private: never shown on the site" />
              </div>
            </EditorCard>

            <EditorCard title="Media" description="Cover image is required to publish. Alt text is required for every image.">
              <MediaField id="cs-cover" label="Cover image" required value={v.cover} onChange={(x) => set('cover', x)} error={errors.cover} />
              <GalleryField value={v.gallery} onChange={(x) => set('gallery', x)} error={errors.gallery} />
            </EditorCard>

            <EditorCard title="Story">
              <MarkdownField id="cs-challenge" label="The challenge" value={v.challenge} onChange={(x) => set('challenge', x)} minRows={8} />
              <MarkdownField id="cs-solution" label="Our solution" value={v.solution} onChange={(x) => set('solution', x)} minRows={8} />
            </EditorCard>

            <EditorCard title="Results" description="Verified metrics only. Shown on the case study and home page.">
              <PairsField value={v.results} onChange={(x) => set('results', x)} />
              {errors.results && <p className="type-caption text-fg-danger">{errors.results}</p>}
            </EditorCard>
          </>
        }
        side={
          <>
            <PublishPanel
              status={v.status}
              onStatus={(x) => set('status', x)}
              publishAt={v.publishAt}
              onPublishAt={(x) => set('publishAt', x)}
              featured={v.isFeatured}
              onFeatured={(x) => set('isFeatured', x)}
              saving={saving}
              savedAt={savedAt}
              dirty={dirty}
              onSave={save}
              error={errors.publishAt}
            />
            <EditorCard title="Classification">
              <fieldset aria-describedby={errors.services ? 'cs-services-error' : undefined}>
                <legend className="mb-2 type-label-sm text-fg">
                  Services <span className="text-fg-subtle">*</span>
                </legend>
                <div className="flex flex-col gap-2">
                  {services.map((s) => {
                    const checked = v.services.includes(s.slug);
                    return (
                      <label key={s.slug} className="flex cursor-pointer items-center gap-2.5 type-body-sm text-fg">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(on) => set('services', on ? [...v.services, s.slug] : v.services.filter((x) => x !== s.slug))}
                        />
                        {s.title}
                      </label>
                    );
                  })}
                </div>
                {errors.services && (
                  <p id="cs-services-error" className="mt-2 type-caption text-fg-danger">
                    {errors.services}
                  </p>
                )}
              </fieldset>
              <ChipsField id="cs-stack" label="Tech stack" value={v.techStack} onChange={(x) => set('techStack', x)} placeholder="Next.js, Firebase…" helper="Press Enter or comma to add" />
              <TextField id="cs-live" label="Live URL" optional type="url" value={v.liveUrl} onChange={(x) => set('liveUrl', x)} placeholder="https://" error={errors.liveUrl} />
            </EditorCard>
            <SeoPanel
              value={v.seo}
              onChange={(x) => set('seo', x)}
              slug={v.slug}
              onSlug={(x) => {
                setSlugTouched(true);
                set('slug', x);
              }}
              slugError={errors.slug}
              prefix="/portfolio/"
              fallbackTitle={v.client ? `${v.client} case study` : 'Case study'}
              fallbackDescription={v.summary || 'Short summary of the project.'}
            />
          </>
        }
      />
    </div>
  );
}
