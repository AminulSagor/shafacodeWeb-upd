'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { savePost } from '@/actions/admin/posts';
import { ChipsField, SelectField, TextAreaField, TextField, useUnsavedWarning } from '@/components/admin/editor/fields';
import { EditorCard, EditorColumns } from '@/components/admin/editor/layout';
import { MarkdownField } from '@/components/admin/editor/markdown-field';
import { MediaField } from '@/components/admin/editor/media-field';
import { PublishPanel } from '@/components/admin/editor/publish-panel';
import { SeoPanel } from '@/components/admin/editor/seo-panel';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categoryLabels } from '@/content/blog';
import { wordCount } from '@/lib/markdown';
import type { PublishStatus } from '@/lib/admin/types';
import type { PostInput } from '@/lib/schemas/admin/post';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);

/** Blog editor. Figma: Blog Editor 57:6134 */
export function PostEditor({
  id,
  initial,
  savedAt: initialSavedAt,
  authors,
}: {
  id: string | null;
  initial: PostInput;
  savedAt: string;
  authors: { id: string; name: string }[];
}) {
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
  const set = <K extends keyof PostInput>(k: K, val: PostInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const minutes = Math.max(1, Math.round(wordCount(v.content) / 220));

  const save = (status?: PublishStatus) =>
    startSaving(async () => {
      const payload = { ...v, status: status ?? v.status };
      const res = await savePost(id, payload);
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
      if (!id && res.data) router.replace(`/admin/blogs/${res.data.id}`);
      else router.refresh();
    });

  const errorList = Object.values(errors);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={id ? 'Edit blog post' : 'New blog post'}
        description={`${v.status === 'draft' ? 'Draft' : v.status[0]!.toUpperCase() + v.status.slice(1)} · /blogs/${v.slug || '…'}`}
        actions={
          id &&
          initial.status === 'published' && (
            <Button asChild variant="secondary">
              <a href={`/blogs/${initial.slug}`} target="_blank" rel="noopener noreferrer">
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
          <EditorCard title="Post">
            <TextField
              id="post-title"
              label="Title"
              required
              value={v.title}
              error={errors.title}
              onChange={(title) => setV((s) => ({ ...s, title, slug: slugTouched ? s.slug : slugify(title) }))}
              placeholder="How to plan an MVP for your startup"
            />
            <TextAreaField id="post-excerpt" label="Excerpt" required rows={3} value={v.excerpt} onChange={(x) => set('excerpt', x)} max={160} error={errors.excerpt} />
            <MarkdownField id="post-content" label="Content" value={v.content} onChange={(x) => set('content', x)} minRows={22} showWords error={errors.content} />
          </EditorCard>
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
              featuredLabel="Feature on the blog home"
              saving={saving}
              savedAt={savedAt}
              dirty={dirty}
              onSave={save}
              error={errors.publishAt}
            />
            <EditorCard title="Details">
              <SelectField id="post-category" label="Category" required value={v.category} onChange={(x) => set('category', x)} options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))} />
              <SelectField
                id="post-author"
                label="Author"
                required
                value={v.authorId}
                onChange={(x) => set('authorId', x)}
                placeholder={authors.some((a) => a.id === '') ? undefined : authors.length ? 'Pick an author' : 'Mark team members as authors first'}
                options={authors.map((a) => ({ value: a.id, label: a.name }))}
                error={errors.authorId}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="post-minutes" className="type-label-sm text-fg">
                  Reading time
                </label>
                <Input id="post-minutes" readOnly value={`${minutes} min (auto)`} />
              </div>
              <ChipsField id="post-tags" label="Tags" value={v.tags} onChange={(x) => set('tags', x)} max={10} helper="Press Enter or comma to add" />
              <MediaField id="post-cover" label="Cover image (1200 × 630)" value={v.cover} onChange={(x) => set('cover', x)} error={errors.cover} />
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
              errors={errors}
              prefix="/blogs/"
              fallbackTitle={v.title || 'Blog post'}
              fallbackDescription={v.excerpt || 'Short summary of the post.'}
            />
          </>
        }
      />
    </div>
  );
}
