import { notFound } from 'next/navigation';
import { ArrowRight, Play, Search } from 'lucide-react';

import { Accent } from '@/components/ui/accent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field } from '@/components/ui/field';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Switch } from '@/components/ui/switch';
import { TagList } from '@/components/ui/tag';
import { TextLink } from '@/components/ui/text-link';
import { Textarea } from '@/components/ui/textarea';
import { ChipDemo } from './chip-demo';

export const metadata = { title: 'UI primitives', robots: { index: false, follow: false } };

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
const sizes = ['lg', 'md', 'sm'] as const;

function Primitives() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <Eyebrow>Buttons</Eyebrow>
        {variants.map((v) => (
          <div key={v} className="flex flex-wrap items-center gap-3">
            {sizes.map((s) => (
              <Button key={s} variant={v} size={s}>
                {v} {s} <ArrowRight aria-hidden />
              </Button>
            ))}
            <Button variant={v} disabled>
              Disabled
            </Button>
            <Button variant={v} loading>
              Loading
            </Button>
          </div>
        ))}
        <div className="flex gap-3">
          <IconButton aria-label="Play">
            <Play aria-hidden />
          </IconButton>
          <IconButton aria-label="Play" variant="primary" size="sm">
            <Play aria-hidden />
          </IconButton>
          <TextLink href="#">Read the case study</TextLink>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <Eyebrow>Badges, chips, tags</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map((t) => (
            <Badge key={t} tone={t} dot>
              {t}
            </Badge>
          ))}
        </div>
        <ChipDemo />
        <TagList items={['Next.js', 'Node.js', 'PostgreSQL']} />
      </section>
      <section className="grid max-w-3xl gap-6 md:grid-cols-2">
        <Field id="f1" label="Full name" required>
          {(a) => <Input {...a} placeholder="Your full name" />}
        </Field>
        <Field id="f2" label="Email" required error="Enter a valid email address">
          {(a) => <Input {...a} type="email" defaultValue="not-an-email" />}
        </Field>
        <Field id="f3" label="Search" helper="Helper text">
          {(a) => (
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-icon" aria-hidden />
              <Input {...a} className="pl-10" placeholder="Search" />
            </div>
          )}
        </Field>
        <Field id="f4" label="Project type" required>
          {(a) => (
            <NativeSelect {...a} defaultValue="" required>
              <option value="" disabled>
                Select a type
              </option>
              <option>Website</option>
              <option>Web app</option>
            </NativeSelect>
          )}
        </Field>
        <Field id="f5" label="Disabled">
          {(a) => <Input {...a} disabled placeholder="Disabled" />}
        </Field>
        <Field id="f6" label="Message" className="md:col-span-2">
          {(a) => <Textarea {...a} placeholder="Tell us about the project" />}
        </Field>
        <label className="flex items-center gap-3 type-body-sm text-fg">
          <Checkbox defaultChecked /> Checked
        </label>
        <label className="flex items-center gap-3 type-body-sm text-fg">
          <Checkbox /> Unchecked
        </label>
        <label className="flex items-center gap-3 type-body-sm text-fg">
          <Switch defaultChecked /> On
        </label>
        <label className="flex items-center gap-3 type-body-sm text-fg">
          <Switch /> Off
        </label>
      </section>
      <section className="flex flex-col gap-4">
        <Eyebrow>Type</Eyebrow>
        <p className="type-display">
          Transparent software <Accent>growing teams</Accent>
        </p>
        <p className="type-h1">
          Heading one <Accent>accent</Accent>
        </p>
        <p className="type-h2">
          Get your software <Accent>without the guesswork</Accent>
        </p>
        <p className="type-h3">Heading three</p>
        <p className="type-body-lg text-fg-muted">Body large: ShafaCode helps growing businesses build websites.</p>
        <p className="type-stat">62%</p>
      </section>
    </div>
  );
}

/** Dev-only gallery of every primitive in dark and light. */
export default function UiGallery() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <div className="container-page flex flex-col gap-16 section-y">
      <h1 className="type-h2">UI primitives</h1>
      <div data-theme="dark" className="rounded-card border border-line-subtle bg-canvas p-8 text-fg">
        <Primitives />
      </div>
      <div data-theme="light" data-ui="admin" className="rounded-card bg-canvas p-8 text-fg">
        <Primitives />
      </div>
    </div>
  );
}
