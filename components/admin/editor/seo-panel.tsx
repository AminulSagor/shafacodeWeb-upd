'use client';

import { site } from '@/content/site';
import { EditorCard } from './layout';
import { SwitchField, TextAreaField, TextField } from './fields';

export type SeoValue = { metaTitle: string; metaDescription: string; canonicalUrl: string; noIndex: boolean };

/** Meta title and description with counters, slug, canonical, noindex and a live Google preview. */
export function SeoPanel({
  value,
  onChange,
  slug,
  onSlug,
  slugError,
  prefix,
  fallbackTitle,
  fallbackDescription,
}: {
  value: SeoValue;
  onChange: (v: SeoValue) => void;
  slug: string;
  onSlug: (v: string) => void;
  slugError?: string;
  prefix: string;
  fallbackTitle: string;
  fallbackDescription: string;
}) {
  const set = <K extends keyof SeoValue>(k: K, v: SeoValue[K]) => onChange({ ...value, [k]: v });
  const host = new URL(site.url).host;
  const title = value.metaTitle || `${fallbackTitle} | ${site.name}`;
  const description = value.metaDescription || fallbackDescription;
  return (
    <EditorCard title="SEO" description="Controls how this page appears in Google and social shares.">
      <TextField id="seo-title" label="Meta title" value={value.metaTitle} onChange={(v) => set('metaTitle', v)} max={60} placeholder={`${fallbackTitle} | ${site.name}`} />
      <TextAreaField id="seo-description" label="Meta description" rows={3} value={value.metaDescription} onChange={(v) => set('metaDescription', v)} max={160} placeholder={fallbackDescription} />
      <TextField
        id="seo-slug"
        label="URL slug"
        required
        value={slug}
        onChange={(v) => onSlug(v.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-'))}
        error={slugError}
        helper={`${prefix}${slug || '…'} · generated from the title, must be unique`}
      />
      <TextField id="seo-canonical" label="Canonical URL" optional type="url" value={value.canonicalUrl} onChange={(v) => set('canonicalUrl', v)} placeholder={`${site.url}${prefix}${slug}`} />
      <SwitchField id="seo-noindex" label="Hide from search engines (noindex)" checked={value.noIndex} onChange={(v) => set('noIndex', v)} />
      <figure className="rounded-field bg-surface-2 p-4">
        <figcaption className="type-mono-xs text-fg-subtle">Google preview</figcaption>
        <p className="mt-2 truncate type-caption font-normal text-fg-muted">
          {host} › {prefix.split('/').filter(Boolean).join(' › ')} › {slug || '…'}
        </p>
        <p className="mt-1 line-clamp-2 type-h5 font-normal text-fg-info">{title}</p>
        <p className="mt-1 line-clamp-2 type-body-sm text-fg-muted">{description}</p>
      </figure>
    </EditorCard>
  );
}
