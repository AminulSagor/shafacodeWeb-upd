'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { NativeSelect } from '@/components/ui/native-select';

/** Select that writes its value to the URL (filters); resets to page 1. */
export function UrlSelect({
  param,
  label,
  options,
  allLabel,
  className,
}: {
  param: string;
  label: string;
  options: { value: string; label: string }[];
  allLabel: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <label className={className}>
      <span className="sr-only">{label}</span>
      <NativeSelect
        value={params.get(param) ?? ''}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value) next.set(param, e.target.value);
          else next.delete(param);
          next.delete('page');
          next.delete('id');
          router.replace(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false });
        }}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </label>
  );
}
