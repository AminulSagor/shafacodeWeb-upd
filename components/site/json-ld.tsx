import type { Thing, WithContext } from 'schema-dts';

type Ld = WithContext<Thing>;

/**
 * JSON-LD script. `<` is escaped so CMS text containing `</script>` cannot
 * break out of the tag. Build the objects with the typed helpers in
 * lib/structured-data.ts (schema-dts).
 */
export function JsonLd({ data }: { data: Ld | readonly Ld[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
