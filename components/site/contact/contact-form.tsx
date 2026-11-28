'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { submitInquiry } from '@/actions/inquiry';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { ConsentField, FormAlert, Honeypot, HONEYPOT, fieldErrors } from '@/components/site/forms/form-parts';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { budgetOptions, inquirySchema, projectTypeOptions, timelineOptions } from '@/lib/schemas/inquiry';
import { fileMime, uploadFile, type UploadedFile } from '@/lib/upload-client';

export type ContactPrefill = {
  projectType?: string;
  message?: string;
  source?: 'contact-page' | 'home-cta' | 'estimator';
  estimate?: string;
};

const ALLOWED = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
const MAX = 10 * 1024 * 1024;

/** Contact form (Figma Contact 51:7454). Fields per spec section 6. */
export function ContactForm({ prefill }: { prefill: ContactPrefill }) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [uploading, setUploading] = React.useState<{ name: string; progress: number } | null>(null);
  const [consent, setConsent] = React.useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const doneRef = React.useRef<HTMLHeadingElement>(null);

  /** Uploads one at a time; FileDropzone already caps the list to the free slots. */
  const addFiles = async (list: File[]) => {
    setErrors((e) => ({ ...e, attachments: '' }));
    for (const file of list) {
      if (!ALLOWED.includes(fileMime(file))) return setErrors((e) => ({ ...e, attachments: 'Use PDF, PNG, JPG or WebP files.' }));
      if (file.size > MAX) return setErrors((e) => ({ ...e, attachments: 'Each file can be up to 10 MB.' }));
      setUploading({ name: file.name, progress: 0 });
      try {
        const up = await uploadFile('attachment', file, (p) => setUploading({ name: file.name, progress: p }));
        setFiles((f) => (f.length < 3 ? [...f, up] : f));
      } catch (err) {
        setErrors((e) => ({ ...e, attachments: err instanceof Error ? err.message : 'Upload failed.' }));
        return;
      } finally {
        setUploading(null);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      fullName: String(fd.get('fullName') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      company: String(fd.get('company') ?? ''),
      projectType: String(fd.get('projectType') ?? ''),
      budgetRange: String(fd.get('budgetRange') ?? ''),
      timeline: String(fd.get('timeline') ?? ''),
      message: String(fd.get('message') ?? ''),
      attachments: files,
      source: prefill.source ?? 'contact-page',
      estimate: prefill.estimate,
      consent,
      website: String(fd.get(HONEYPOT) ?? ''),
    };
    setErrors({});
    // The honeypot is checked on the server only, so autofill can never block a person.
    const parsed = inquirySchema.omit({ website: true }).safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      setFormError('Please check the highlighted fields.');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setPending(true);
    setFormError(null);
    let res: Awaited<ReturnType<typeof submitInquiry>>;
    try {
      res = await submitInquiry(values as Parameters<typeof submitInquiry>[0]);
    } catch {
      res = { ok: false, error: 'We could not send your request. Check your connection and try again, or email us.' };
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
      <div className="rounded-md border border-line-subtle bg-surface-1 p-8">
        <CheckCircle2 className="size-8 text-fg-success" aria-hidden />
        <h2 ref={doneRef} tabIndex={-1} className="mt-4 type-h3 text-fg outline-none">
          Thanks, we have your request
        </h2>
        <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 type-body text-fg-muted marker:text-fg-brand">
          <li>We review your goals and reply within 12 hours on business days.</li>
          <li>We book a short call to clarify scope, timeline and budget.</li>
          <li>You get a written plan with milestones and a fixed estimate.</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/portfolio">See our work meanwhile</Link>
          </Button>
        </div>
      </div>
    );
  }

  const err = (k: string) => errors[k] || undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-md border border-line-subtle bg-surface-1 p-card md:p-6">
      <h2 className="type-h4 text-fg">Request a project estimate</h2>

      {formError && (
        <FormAlert ref={summaryRef} className="mt-5">
          {formError}
        </FormAlert>
      )}
      {prefill.estimate && (
        <p className="mt-5 rounded-sm border border-brand-soft-border bg-brand-soft p-3 type-body-sm text-fg">
          <span className="type-mono-xs text-fg-brand">From the estimator · </span>
          {prefill.estimate}
        </p>
      )}

      <Honeypot id="contact-hp" />

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field id="fullName" label="Full name" required error={err('fullName')}>
          {(a) => <Input {...a} name="fullName" autoComplete="name" placeholder="John Doe" />}
        </Field>
        <Field id="email" label="Email address" required error={err('email')}>
          {(a) => <Input {...a} name="email" type="email" autoComplete="email" placeholder="john@company.com" />}
        </Field>
        <Field id="phone" label="Phone / WhatsApp" error={err('phone')}>
          {(a) => <Input {...a} name="phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" />}
        </Field>
        <Field id="company" label="Company" optional error={err('company')}>
          {(a) => <Input {...a} name="company" autoComplete="organization" />}
        </Field>
        <Field id="projectType" label="Project type" required error={err('projectType')}>
          {(a) => (
            <NativeSelect {...a} name="projectType" defaultValue={prefill.projectType ?? ''} required>
              <option value="" disabled>
                Select type
              </option>
              {projectTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field id="budgetRange" label="Budget range" error={err('budgetRange')}>
          {(a) => (
            <NativeSelect {...a} name="budgetRange" defaultValue="">
              <option value="">Select range</option>
              {budgetOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field id="timeline" label="Timeline" error={err('timeline')} className="md:col-span-2">
          {(a) => (
            <NativeSelect {...a} name="timeline" defaultValue="">
              <option value="">Select timeline</option>
              {timelineOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field id="message" label="Project description" required error={err('message')} className="md:col-span-2">
          {(a) => <Textarea {...a} name="message" defaultValue={prefill.message} placeholder="Core features, target users and main goals…" />}
        </Field>

        <Field id="attachments" label="Attachments" optional helper="Up to 3 files: PDF, PNG, JPG or WebP, 10 MB each" error={err('attachments')} className="md:col-span-2">
          {(a) => (
            <FileDropzone
              id={a.id}
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
              max={3}
              files={files}
              uploading={uploading}
              onFiles={addFiles}
              onRemove={(i) => setFiles((all) => all.filter((_, j) => j !== i))}
              hint="PDF, PNG, JPG or WebP"
              invalid={a['aria-invalid']}
              describedBy={a['aria-describedby']}
              disabled={pending}
            />
          )}
        </Field>
      </div>

      <div className="mt-5">
        <ConsentField id="contact-consent" checked={consent} onChange={setConsent} error={err('consent')}>
          I agree that ShafaCode may contact me about this request.
        </ConsentField>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:items-center">
        <Button type="submit" size="lg" loading={pending} disabled={!!uploading}>
          Request project estimate <ArrowRight aria-hidden />
        </Button>
        <p className="type-caption font-normal text-fg-subtle">No spam. We never share your details.</p>
      </div>
    </form>
  );
}
