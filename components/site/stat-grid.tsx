/** Track-record stats in bordered cells; the unit is lime. Figma: Stat 18:2833 */
export function StatGrid({ items, label }: { items: { value: string; unit?: string; label: string }[]; label: string }) {
  return (
    <section aria-label={label} className="container-page">
      <dl className="grid grid-cols-2 gap-3 md:gap-grid xl:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="flex flex-col rounded-md border border-line-subtle bg-surface-1 p-5 md:p-6">
            <dt className="order-last mt-1 type-caption font-normal text-fg-subtle">{s.label}</dt>
            <dd className="type-stat text-fg">
              {s.value}
              {s.unit && <span className="text-fg-brand">{s.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
