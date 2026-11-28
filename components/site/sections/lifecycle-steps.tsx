import { Clock } from 'lucide-react';

import type { LifecycleStep } from '@/content/process';

/** Numbered steps with a hairline to the next. Figma: Process Step 18:2838 */
export function LifecycleSteps({ steps }: { steps: LifecycleStep[] }) {
  return (
    <ol role="list" className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="flex h-full flex-col">
          <div className="flex items-center gap-3" aria-hidden>
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line type-mono-xs text-fg-brand">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="h-px flex-1 bg-line-subtle" />
          </div>
          <h3 className="mt-5 type-h5 text-fg">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className="mt-3 type-body-sm text-fg-muted">{s.body}</p>
          <p className="mt-auto flex items-center gap-1.5 pt-5 type-caption font-normal text-fg-subtle">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            {s.time}
          </p>
        </li>
      ))}
    </ol>
  );
}
