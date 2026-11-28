import { cn } from '@/lib/utils';

/** 8 + 4 editor columns; the sidebar sticks on desktop. Figma: Case Study Editor 57:5032 */
export function EditorColumns({ main, side }: { main: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="grid items-start gap-4 pb-24 xl:grid-cols-[minmax(0,1fr)_--spacing(95)] xl:pb-0">
      <div className="flex min-w-0 flex-col gap-4">{main}</div>
      <div className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-19">{side}</div>
    </div>
  );
}

/** Editor card with title and optional description. */
export function EditorCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = `card-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <section aria-labelledby={id} className={cn('rounded-md border border-line-subtle bg-surface-1 p-5', className)}>
      <h2 id={id} className="type-h5 text-fg">
        {title}
      </h2>
      {description && <p className="mt-1 type-caption font-normal text-fg-subtle">{description}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}
