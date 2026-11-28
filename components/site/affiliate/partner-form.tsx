'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { submitAffiliateLead } from '@/actions/affiliate';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormAlert, Honeypot, HONEYPOT, fieldErrors } from '@/components/site/forms/form-parts';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { affiliateSchema } from '@/lib/schemas/affiliate';
import { fileMime, uploadFile, type UploadedFile } from '@/lib/upload-client';

const ALLOWED = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

/** Partner application (Figma Affiliate "Join" 52:8561). */
export function PartnerForm() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [file, setFile] = React.useState<UploadedFile | null>(null);
  const [uploading, setUploading] = React.useState<{ name: string; progress: number } | null>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const doneRef = React.useRef<HTMLHeadingElement>(null);

  const onFile = async ([f]: File[]) => {
    if (!f) return;
    setErrors((e) => ({ ...e, attachment: '' }));
    if (!ALLOWED.includes(fileMime(f))) return setErrors((e) => ({ ...e, attachment: 'Use a PDF or image file.' }));
    if (f.size > 10 * 1024 * 1024) return setErrors((e) => ({ ...e, attachment: 'The file can be up to 10 MB.' }));
    setUploading({ name: f.name, progress: 0 });
    try {
      setFile(await uploadFile('affiliate', f, (p) => setUploading({ name: f.name, progress: p })));
    } catch (err) {
      setErrors((e) => ({ ...e, attachment: err instanceof Error ? err.message : 'Upload failed.' }));
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      fullName: String(fd.get('fullName') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message: String(fd.get('message') ?? ''),
      attachment: file ?? undefined,
      website: String(fd.get(HONEYPOT) ?? ''),
    };
    setErrors({});
    // The honeypot is checked on the server only, so autofill can never block a person.
    const parsed = affiliateSchema.omit({ website: true }).safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      setFormError('Please check the highlighted fields.');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setPending(true);
    setFormError(null);
    let res: Awaited<ReturnType<typeof submitAffiliateLead>>;
    try {
      res = await submitAffiliateLead(values);
    } catch {
      res = { ok: false, error: 'We could not send your details. Check your connection and try again.' };
    } finally {
      setPending(false);
    }
    if (res.ok) {
      setDone(true);
      requestAnimationFrame(() => doneRef.current?.focus());
    } else {
      setErrors(res.fieldErrors ?? {});
      setFormError(res.error);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  };

  if (done) {
    return (
      <div className="rounded-card border border-line-subtle bg-surface-1 p-8">
        <CheckCircle2 className="size-8 text-fg-success" aria-hidden />
        <h3 ref={doneRef} tabIndex={-1} className="mt-4 type-h3 text-fg outline-none">
          Welcome aboard
        </h3>
        <p className="mt-3 type-body text-fg-muted">
          Thanks for joining. We will send your partner kit and referral details within one business day.
        </p>
      </div>
    );
  }

  const err = (k: string) => errors[k] || undefined;
  return (
    <form onSubmit={onSubmit} noValidate className="rounded-card border border-line-subtle bg-surface-1 p-card md:p-6">
      {formError && (
        <FormAlert ref={summaryRef} className="mb-5">
          {formError}
        </FormAlert>
      )}
      <Honeypot id="partner-hp" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="partner-name" label="Full name" required error={err('fullName')}>
          {(a) => <Input {...a} name="fullName" autoComplete="name" placeholder="Your name" />}
        </Field>
        <Field id="partner-email" label="Email address" required error={err('email')}>
          {(a) => <Input {...a} name="email" type="email" autoComplete="email" placeholder="you@example.com" />}
        </Field>
        <Field id="partner-phone" label="Phone / WhatsApp" required error={err('phone')} className="md:col-span-2">
          {(a) => <Input {...a} name="phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" />}
        </Field>
        <Field id="partner-message" label="Message" optional error={err('message')} className="md:col-span-2">
          {(a) => <Textarea {...a} name="message" placeholder="Tell us about your network or a project you have in mind…" />}
        </Field>
        <Field id="partner-file" label="Attachment" optional error={err('attachment')} className="md:col-span-2">
          {(a) => (
            <FileDropzone
              id={a.id}
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
              files={file ? [file] : []}
              uploading={uploading}
              onFiles={onFile}
              onRemove={() => setFile(null)}
              hint="PDF or image, up to 10 MB"
              invalid={a['aria-invalid']}
              describedBy={a['aria-describedby']}
              disabled={pending}
            />
          )}
        </Field>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full" loading={pending} disabled={!!uploading}>
        Submit application <ArrowRight aria-hidden />
      </Button>
      <p className="mt-3 type-caption font-normal text-fg-subtle">
        We use these details only to set up your partner account. See the{' '}
        <Link href="/privacy-policy" className="rounded-sm text-fg-brand underline underline-offset-4 focus-visible:focus-ring">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
