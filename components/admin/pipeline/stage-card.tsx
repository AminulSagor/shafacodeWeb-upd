'use client';

import * as React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

import { setApplicationStage, setInterviewTime } from '@/actions/admin/pipeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { applicationStages, stageLabel, type ApplicationStage } from '@/lib/admin/types';

const flow: ApplicationStage[] = ['new', 'screening', 'interview', 'offer', 'hired'];
export const nextStage = (s: ApplicationStage) => (s === 'rejected' || s === 'hired' ? null : flow[flow.indexOf(s) + 1] ?? null);

/** Stage select, interview time (Dhaka, GMT+6), Reject and Move to next. Figma: Stage card 61:8290 */
export function StageCard({ id, stage, interviewLocal }: { id: string; stage: ApplicationStage; interviewLocal: string }) {
  const [current, setCurrent] = React.useState(stage);
  const [when, setWhen] = React.useState(interviewLocal);
  const [pending, startTransition] = React.useTransition();
  const next = nextStage(current);

  const move = (to: ApplicationStage, undo = false) =>
    startTransition(async () => {
      const before = current;
      setCurrent(to);
      const res = await setApplicationStage(id, to);
      if (!res.ok) {
        setCurrent(before);
        return void toast.error(res.error);
      }
      if (undo) return void toast.success('Change undone');
      toast.success(`Moved to ${stageLabel[to]}`, { action: { label: 'Undo', onClick: () => move(before, true) } });
    });

  return (
    <section aria-labelledby="stage-title" className="rounded-md border border-line-subtle bg-surface-1 p-5">
      <h2 id="stage-title" className="type-h5 text-fg">
        Stage
      </h2>
      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="app-stage" className="type-label-sm text-fg">
          Current stage
        </label>
        <NativeSelect id="app-stage" value={current} disabled={pending} onChange={(e) => move(e.target.value as ApplicationStage)}>
          {applicationStages.map((s) => (
            <option key={s} value={s}>
              {stageLabel[s]}
            </option>
          ))}
        </NativeSelect>
      </div>
      <form
        className="mt-4 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            const res = await setInterviewTime(id, when);
            if (res.ok) toast.success(res.message ?? 'Saved');
            else toast.error(res.error);
          });
        }}
      >
        <label htmlFor="app-interview" className="type-label-sm text-fg">
          Interview <span className="font-normal text-fg-subtle">(Dhaka time, GMT+6)</span>
        </label>
        <div className="flex gap-2">
          <Input id="app-interview" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="min-w-0 flex-1" />
          <Button type="submit" variant="secondary" disabled={pending || when === interviewLocal}>
            Save
          </Button>
        </div>
      </form>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="secondary" disabled={pending || current === 'rejected'} onClick={() => move('rejected')}>
          <X aria-hidden /> Reject
        </Button>
        <Button disabled={pending || !next} onClick={() => next && move(next)}>
          {next ? (
            <>
              Move to {stageLabel[next]} <ArrowRight aria-hidden />
            </>
          ) : (
            'Final stage'
          )}
        </Button>
      </div>
    </section>
  );
}
