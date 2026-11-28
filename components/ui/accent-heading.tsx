import { Accent } from '@/components/ui/accent';
import type { AccentHeading } from '@/content/service-details';

/** Renders `${before} <Accent>{accent}</Accent>${after}` from content data. */
export function AccentText({ value }: { value: AccentHeading }) {
  return (
    <>
      {value.before} <Accent>{value.accent}</Accent>
      {value.after}
    </>
  );
}

export const accentToText = (value: AccentHeading) => `${value.before} ${value.accent}${value.after ?? ''}`;
