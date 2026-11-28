'use client';

import * as React from 'react';
import { Check, ExternalLink, X } from 'lucide-react';

import { saveSettings } from '@/actions/admin/settings';
import { SwitchField, TextAreaField, TextField } from '@/components/admin/editor/fields';
import { EditorCard, EditorColumns } from '@/components/admin/editor/layout';
import { MediaField } from '@/components/admin/editor/media-field';
import { ErrorSummary, useEditor } from '@/components/admin/editor/use-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { SiteSettings } from '@/lib/schemas/admin/settings';

/** Site Settings form. Figma: Site Settings 61:9626 */
export function SettingsForm({ initial, savedAt }: { initial: SiteSettings; savedAt: string }) {
  const e = useEditor<SiteSettings>({
    id: 'site',
    initial,
    savedAt,
    base: '/admin/settings',
    action: async (_id, value) => {
      const res = await saveSettings(value);
      return res.ok ? { ok: true, message: res.message, data: { id: 'site' } } : res;
    },
  });
  const v = e.value;
  const [confirmOff, setConfirmOff] = React.useState(false);
  const n = (k: keyof SiteSettings['notifications'], val: boolean | string) => e.set('notifications', { ...v.notifications, [k]: val });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" disabled={!e.dirty || e.saving} onClick={() => e.setValue(initial)}>
          <X aria-hidden /> Discard
        </Button>
        <Button type="button" loading={e.saving} disabled={!e.dirty} onClick={() => e.save()}>
          <Check aria-hidden /> Save changes
        </Button>
      </div>
      <ErrorSummary errors={e.errors} summaryRef={e.summaryRef} />
      <EditorColumns
        main={
          <>
            <div id="general" className="scroll-mt-24">
              <EditorCard title="Brand">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField id="s-name" label="Site name" required value={v.siteName} onChange={(x) => e.set('siteName', x)} error={e.errors.siteName} />
                  <TextField id="s-tagline" label="Tagline" value={v.tagline} onChange={(x) => e.set('tagline', x)} />
                </div>
                <TextField id="s-domain" label="Primary domain" required type="url" value={v.domain} onChange={(x) => e.set('domain', x)} error={e.errors.domain} helper="Canonical URLs, the sitemap and Open Graph links use the deployment's NEXT_PUBLIC_SITE_URL; keep the two the same." />
              </EditorCard>
            </div>
            <div id="seo" className="scroll-mt-24">
              <EditorCard title="Search defaults" description="Used when a page has no SEO fields of its own.">
                <TextField id="s-template" label="Title template" required value={v.titleTemplate} onChange={(x) => e.set('titleTemplate', x)} error={e.errors.titleTemplate} helper="%s is replaced with the page title" />
                <TextAreaField id="s-desc" label="Default meta description" required rows={3} value={v.defaultDescription} onChange={(x) => e.set('defaultDescription', x)} max={160} error={e.errors.defaultDescription} />
                <MediaField id="s-og" label="Default social image (1200 × 630)" value={v.defaultOgImage} onChange={(x) => e.set('defaultOgImage', x)} error={e.errors.defaultOgImage} />
                <SwitchField
                  id="s-index"
                  label="Allow search engines to index the site"
                  helper={v.allowIndexing ? 'On: production pages can appear in Google.' : 'Off: every page asks search engines not to index it.'}
                  checked={v.allowIndexing}
                  onChange={(on) => (on ? e.set('allowIndexing', true) : setConfirmOff(true))}
                />
              </EditorCard>
            </div>
            <div id="business" className="scroll-mt-24">
              <EditorCard title="Business details" description="The business record for the team.">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField id="s-legal" label="Legal name" value={v.legalName} onChange={(x) => e.set('legalName', x)} />
                  <TextField id="s-email" label="Public email" required type="email" value={v.email} onChange={(x) => e.set('email', x)} error={e.errors.email} />
                  <TextField id="s-phone" label="Phone" value={v.phone} onChange={(x) => e.set('phone', x)} />
                  <TextField id="s-address" label="Address" value={v.address} onChange={(x) => e.set('address', x)} />
                  <TextField id="s-linkedin" label="LinkedIn page" type="url" value={v.linkedinUrl} onChange={(x) => e.set('linkedinUrl', x)} error={e.errors.linkedinUrl} />
                  <TextField id="s-facebook" label="Facebook page" type="url" value={v.facebookUrl} onChange={(x) => e.set('facebookUrl', x)} error={e.errors.facebookUrl} />
                </div>
              </EditorCard>
            </div>
          </>
        }
        side={
          <>
            <div id="notifications" className="scroll-mt-24">
              <EditorCard title="Notifications" description="Emails sent when something new arrives.">
                <SwitchField id="n-inq" label="New contact inquiry" checked={v.notifications.inquiry} onChange={(x) => n('inquiry', x)} />
                <SwitchField id="n-app" label="New job application" checked={v.notifications.application} onChange={(x) => n('application', x)} />
                <SwitchField id="n-aff" label="New affiliate lead" checked={v.notifications.affiliate} onChange={(x) => n('affiliate', x)} />
                <SwitchField id="n-week" label="Weekly summary" helper="Stored now; sending it needs the scheduled job." checked={v.notifications.weeklySummary} onChange={(x) => n('weeklySummary', x)} />
                <TextField id="n-to" label="Send to" required type="email" value={v.notifications.recipient} onChange={(x) => n('recipient', x)} error={e.errors['notifications.recipient']} />
              </EditorCard>
            </div>
            <EditorCard title="Integrations">
              <TextField id="s-ga" label="Google Analytics 4 ID" value={v.ga4Id} onChange={(x) => e.set('ga4Id', x.toUpperCase())} error={e.errors.ga4Id} placeholder="G-XXXXXXXXXX" helper="Loads only after a visitor accepts analytics cookies (consent banner pending)." />
              <TextField id="s-gsc" label="Search Console verification" value={v.searchConsoleVerification} onChange={(x) => e.set('searchConsoleVerification', x)} error={e.errors.searchConsoleVerification} placeholder="content value of the meta tag" />
            </EditorCard>
            <EditorCard title="Sitemap and robots">
              {[
                { href: '/sitemap.xml', label: 'sitemap.xml', note: 'Pages, case studies, posts and roles' },
                { href: '/robots.txt', label: 'robots.txt', note: v.allowIndexing ? 'Allows all, blocks /admin' : 'Blocks everything' },
              ].map((l) => (
                <div key={l.href} className="flex items-center justify-between gap-3">
                  <span className="flex flex-col">
                    <span className="type-mono-sm text-fg">{l.label}</span>
                    <span className="type-caption font-normal text-fg-subtle">{l.note}</span>
                  </span>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-sm type-label-sm text-fg-brand hover:underline focus-visible:focus-ring">
                    <ExternalLink className="size-4" aria-hidden /> View
                  </a>
                </div>
              ))}
            </EditorCard>
          </>
        }
      />
      <AlertDialog open={confirmOff} onOpenChange={setConfirmOff}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide the whole site from search?</AlertDialogTitle>
            <AlertDialogDescription>
              Every page will ask search engines not to index it and robots.txt will block crawling. Rankings drop within days. Save to apply.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep indexing</AlertDialogCancel>
            <AlertDialogAction onClick={() => e.set('allowIndexing', false)}>Turn off indexing</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
