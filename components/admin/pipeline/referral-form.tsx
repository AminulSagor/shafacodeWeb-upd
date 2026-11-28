'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { updateLeadReferral } from '@/actions/admin/pipeline';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { commissionFor } from '@/content/affiliate';

const k = (n: number) => `৳${Math.round(n / 1000)}k`;

/** Referred project, partner type and estimated value; shows the commission live. */
export function ReferralForm({
  id,
  initial,
}: {
  id: string;
  initial: { referredProject: string; partnerType: string; estValue: number | null };
}) {
  const [value, setValue] = React.useState(initial.estValue ? String(initial.estValue) : '');
  const [error, setError] = React.useState<string>();
  const [pending, startTransition] = React.useTransition();
  const amount = Number(value.replace(/[^\d.]/g, ''));
  const c = amount > 0 ? commissionFor(amount) : null;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await updateLeadReferral(id, {
            referredProject: String(fd.get('referredProject') ?? ''),
            partnerType: String(fd.get('partnerType') ?? ''),
            estValue: value,
          });
          if (res.ok) {
            setError(undefined);
            toast.success(res.message ?? 'Saved');
          } else {
            setError(res.fieldErrors?.estValue);
            toast.error(res.error);
          }
        });
      }}
    >
      <Field id="lead-project" label="Referred project">
        {(a) => <Input {...a} name="referredProject" defaultValue={initial.referredProject} placeholder="Clinic booking app" maxLength={160} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="lead-type" label="Partner type">
          {(a) => <Input {...a} name="partnerType" defaultValue={initial.partnerType} placeholder="Freelance consultant" maxLength={80} />}
        </Field>
        <Field
          id="lead-value"
          label="Est. project value (৳)"
          error={error}
          helper={c ? `Commission ${k(c.low)} to ${k(c.high)}` : 'Commission follows the partner tiers.'}
        >
          {(a) => <Input {...a} inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="350000" />}
        </Field>
      </div>
      <Button type="submit" variant="secondary" size="sm" className="self-end" loading={pending}>
        Save referral
      </Button>
    </form>
  );
}
