'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { submitApplication } from '@/actions/apply';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { ConsentField, FormAlert, Honeypot, HONEYPOT, fieldErrors } from '@/components/site/forms/form-parts';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { applicationSchema, experienceLabels, experienceRanges } from '@/lib/schemas/application';
import { fileMime, uploadFile, type UploadedFile } from '@/lib/upload-client';

type Errors = Record<string, string>;

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-md border border-line-subtle bg-surface-1 p-card md:p-6">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden className="type-h5 text-fg">
        {title}
      </p>
      {description && <p className="mt-1 type-caption font-normal text-fg-subtle">{description}</p>}
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Job application form (Figma Job Apply 50:6935). Resume uploads before submit. */
export function ApplyForm({ jobSlug, jobTitle, privateUploads }: { jobSlug: string; jobTitle: string; privateUploads: boolean }) {
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [resume, setResume] = React.useState<UploadedFile | null>(null);
  const [uploading, setUploading] = React.useState<{ name: string; progress: number } | null>(null);
  const [consent, setConsent] = React.useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const doneRef = React.useRef<HTMLHeadingElement>(null);

  const onFile = async ([file]: File[]) => {
    if (!file) return;
    setErrors((e) => ({ ...e, resume: '' }));
    if (fileMime(file) !== 'application/pdf') return setErrors((e) => ({ ...e, resume: 'Upload your resume as a PDF.' }));
    if (file.size > 5 * 1024 * 1024) return setErrors((e) => ({ ...e, resume: 'The PDF can be up to 5 MB.' }));
    setUploading({ name: file.name, progress: 0 });
    try {
      setResume(await uploadFile('resume', file, (p) => setUploading({ name: file.name, progress: p })));
    } catch (err) {
      setErrors((e) => ({ ...e, resume: err instanceof Error ? err.message : 'Upload failed.' }));
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      jobSlug,
      fullName: String(fd.get('fullName') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      location: String(fd.get('location') ?? ''),
      portfolioUrl: String(fd.get('portfolioUrl') ?? ''),
      linkedinUrl: String(fd.get('linkedinUrl') ?? ''),
      githubUrl: String(fd.get('githubUrl') ?? ''),
      experienceRange: String(fd.get('experienceRange') ?? '') as (typeof experienceRanges)[number],
      primaryFramework: String(fd.get('primaryFramework') ?? ''),
      whyUs: String(fd.get('whyUs') ?? ''),
      resume: resume ? { ...resume } : undefined,
      consent: consent as true,
      website: String(fd.get(HONEYPOT) ?? ''),
    };
    setErrors({});
    // The honeypot is checked on the server only, so autofill can never block a person.
    const parsed = applicationSchema.omit({ website: true }).safeParse(values);
    if (!parsed.success) {
      const next: Errors = fieldErrors(parsed.error.issues);
      if (!values.resume) next.resume = 'Upload your resume as a PDF.';
      setErrors(next);
      setFormError('Please check the highlighted fields.');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setPending(true);
    setFormError(null);
    let res: Awaited<ReturnType<typeof submitApplication>>;
    try {
      res = await submitApplication(values as Parameters<typeof submitApplication>[0]);
    } catch {
      res = { ok: false, error: 'We could not send your application. Check your connection and try again.' };
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
          Application sent
        </h2>
        <p className="mt-3 max-w-xl type-body text-fg-muted">
          Thanks for applying for {jobTitle}. We read every application and reply within 48 hours. If it is a match, we
          will invite you to a short call.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/careers">See other roles</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/blogs">Read our blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const err = (k: string) => errors[k] || undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-grid">
      {formError && (
        <FormAlert ref={summaryRef} className="rounded-md">
          {formError}
        </FormAlert>
      )}

      <Honeypot id="apply-hp" />

      <Panel title="Personal information">
        <Field id="fullName" label="Full name" required error={err('fullName')}>
          {(a) => <Input {...a} name="fullName" autoComplete="name" placeholder="Jane Doe" />}
        </Field>
        <Field id="email" label="Email address" required error={err('email')}>
          {(a) => <Input {...a} name="email" type="email" autoComplete="email" placeholder="jane@example.com" />}
        </Field>
        <Field id="phone" label="Phone number" error={err('phone')}>
          {(a) => <Input {...a} name="phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" />}
        </Field>
        <Field id="location" label="Location" error={err('location')}>
          {(a) => <Input {...a} name="location" autoComplete="address-level2" placeholder="City, Country" />}
        </Field>
      </Panel>

      <Panel title="Professional links" description="Optional, but they help us review faster.">
        <Field id="portfolioUrl" label="Portfolio URL" error={err('portfolioUrl')}>
          {(a) => <Input {...a} name="portfolioUrl" type="url" inputMode="url" placeholder="https://" />}
        </Field>
        <Field id="linkedinUrl" label="LinkedIn" error={err('linkedinUrl')}>
          {(a) => <Input {...a} name="linkedinUrl" inputMode="url" placeholder="linkedin.com/in/…" />}
        </Field>
        <Field id="githubUrl" label="GitHub" error={err('githubUrl')} className="md:col-span-2">
          {(a) => <Input {...a} name="githubUrl" inputMode="url" placeholder="github.com/…" />}
        </Field>
      </Panel>

      <Panel title="Experience">
        <Field id="experienceRange" label="Years of experience" required error={err('experienceRange')}>
          {(a) => (
            <NativeSelect {...a} name="experienceRange" defaultValue="" required>
              <option value="" disabled>
                Select a range
              </option>
              {experienceRanges.map((r) => (
                <option key={r} value={r}>
                  {experienceLabels[r]}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field id="primaryFramework" label="Primary framework" error={err('primaryFramework')}>
          {(a) => <Input {...a} name="primaryFramework" placeholder="React, Vue, Svelte…" />}
        </Field>
        <Field id="whyUs" label="Why ShafaCode?" helper="Optional · 500 characters max" error={err('whyUs')} className="md:col-span-2">
          {(a) => <Textarea {...a} name="whyUs" maxLength={500} placeholder="Tell us what draws you to our engineering culture…" />}
        </Field>
      </Panel>

      <fieldset className="rounded-md border border-line-subtle bg-surface-1 p-card md:p-6">
        <legend className="sr-only">Resume</legend>
        <p aria-hidden className="type-h5 text-fg">
          Resume
        </p>
        <div className="mt-5">
          <Field id="resume" label="Resume / CV (PDF, max 5 MB)" required error={err('resume')}>
            {(a) => (
              <FileDropzone
                id={a.id}
                accept="application/pdf,.pdf"
                files={resume ? [resume] : []}
                uploading={uploading}
                onFiles={onFile}
                onRemove={() => setResume(null)}
                hint="PDF only, up to 5 MB"
                invalid={a['aria-invalid']}
                describedBy={a['aria-describedby']}
                disabled={pending}
              />
            )}
          </Field>
        </div>
      </fieldset>

      <ConsentField id="apply-consent" checked={consent} onChange={setConsent} error={err('consent')}>
        I agree that ShafaCode may store my application for this and future roles for 12 months.
      </ConsentField>

      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
        <Button type="submit" size="lg" loading={pending} disabled={!!uploading}>
          Submit application <ArrowRight aria-hidden />
        </Button>
        <p className="type-caption font-normal text-fg-subtle">
          {privateUploads
            ? 'Your data is private: resumes are stored in a private bucket with expiring links.'
            : 'Only the hiring team reviews your application.'}
        </p>
      </div>
    </form>
  );
}
