'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { ChipRadioGroup } from '@/components/ui/chip-radio-group';
import { site } from '@/content/site';

type City = { label: string; zone: string };

const CITIES: City[] = [
  { label: 'London', zone: 'Europe/London' },
  { label: 'Berlin', zone: 'Europe/Berlin' },
  { label: 'Dubai', zone: 'Asia/Dubai' },
  { label: 'New York', zone: 'America/New_York' },
];

const noopSubscribe = () => () => {};

const TEAM_OFFSET =site.workingHours.utcOffset * 60; // minutes
const TEAM_START = site.workingHours.start;
const TEAM_END = site.workingHours.end;
const VISITOR_START = 9;
const VISITOR_END = 18;

/** Current UTC offset of an IANA zone in minutes, via Intl (no date library). */
function offsetMinutes(zone: string, at: Date) {
  let name: string | undefined;
  try {
    name = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' })
      .formatToParts(at)
      .find((p) => p.type === 'timeZoneName')?.value;
  } catch {
    return 0;
  }
  const m = name?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

const gmtLabel = (min: number) => {
  const sign = min < 0 ? '-' : '+';
  const h = Math.floor(Math.abs(min) / 60);
  const m = Math.abs(min) % 60;
  return `GMT${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
};

const hhmm = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/**
 * Visitor's 09:00 to 18:00 against the team's 10:00 to 20:00 (GMT+6), on a
 * 24-hour track in Bangladesh time. Defaults to the visitor's own zone.
 * Figma: Timezone Overlap 42:3835
 */
export function TimezoneOverlap({ className }: { className?: string }) {
  // The visitor's zone (null during SSR, so the server renders London).
  const own = React.useSyncExternalStore(
    noopSubscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => null
  );
  // Offsets depend on the date (daylight saving), so read "now" on the client
  // only; the static server render uses a fixed winter date.
  const hour = React.useSyncExternalStore(
    noopSubscribe,
    () => Math.floor(Date.now() / 3_600_000),
    () => null
  );
  const now = hour === null ? new Date(Date.UTC(2026, 0, 15, 12)) : new Date(hour * 3_600_000);
  const [picked, setZone] = React.useState<string | null>(null);

  const ownUsable = own && !/^(Asia\/(Dhaka|Dacca)|(Etc\/)?(UTC|GMT|Universal|Zulu))$/.test(own) ? own : null;
  const cities =
    ownUsable && !CITIES.some((c) => c.zone === ownUsable)
      ? [{ label: ownUsable.split('/').pop()?.replace(/_/g, ' ') ?? 'Your city', zone: ownUsable }, ...CITIES]
      : CITIES;
  const zone = picked ?? ownUsable ?? CITIES[0].zone;
  const city = cities.find((c) => c.zone === zone) ?? cities[0];
  const offset = offsetMinutes(zone, now);
  const shift = TEAM_OFFSET - offset; // add to visitor time to get BD time
  const vStart = VISITOR_START * 60 + shift;
  const vEnd = VISITOR_END * 60 + shift;

  const inVisitor = (h: number) =>
    [-1440, 0, 1440].some((d) => h * 60 + 30 >= vStart + d && h * 60 + 30 < vEnd + d);
  const inTeam = (h: number) => h >= TEAM_START && h < TEAM_END;
  const overlap = Array.from({ length: 24 }, (_, h) => inVisitor(h) && inTeam(h));
  const overlapHours = overlap.filter(Boolean).length;
  const firstOverlap = overlap.indexOf(true);
  const standup = firstOverlap >= 0 ? hhmm(firstOverlap * 60 + 30 - shift) : null;

  const titleId = React.useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn('rounded-card border border-line-subtle bg-surface-1 p-card md:p-6', className)}
    >
      <h3 id={titleId} className="type-h4 text-fg">
        Your hours, our hours
      </h3>
      <ChipRadioGroup
        className="mt-1"
        name={`${titleId}-city`}
        legend={<span className="sr-only">Choose your city</span>}
        options={cities.map((c) => ({ value: c.zone, label: c.label }))}
        value={zone}
        onChange={setZone}
      />

      <div className="mt-5">
        <p className="type-caption font-normal text-fg-muted">
          Barishal team ({gmtLabel(TEAM_OFFSET)}) · {hhmm(TEAM_START * 60)} to {hhmm(TEAM_END * 60)}
        </p>
        <div aria-hidden className="mt-2 grid grid-cols-24 gap-1">
          {Array.from({ length: 24 }, (_, h) => (
            <span
              key={h}
              className={cn('h-5 rounded-xs transition-colors duration-(--duration-base)', inTeam(h) ? 'bg-action-primary' : 'bg-surface-2')}
            />
          ))}
        </div>
        <p className="mt-4 type-caption font-normal text-fg-muted">
          {city.label} ({gmtLabel(offset)}) · your {hhmm(VISITOR_START * 60)} to {hhmm(VISITOR_END * 60)}, shown in
          Bangladesh time
        </p>
        <div aria-hidden className="mt-2 grid grid-cols-24 gap-1">
          {Array.from({ length: 24 }, (_, h) => (
            <span
              key={h}
              className={cn(
                'h-5 rounded-xs transition-colors duration-(--duration-base)',
                overlap[h] ? 'bg-action-primary' : inVisitor(h) ? 'bg-surface-3' : 'bg-surface-2'
              )}
            />
          ))}
        </div>
        <div aria-hidden className="mt-3 flex justify-between type-mono-xs text-fg-subtle tabular">
          {['00', '06', '12', '18', '24'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <output aria-live="polite" aria-atomic="true" className="mt-5 flex items-center gap-4 border-t border-line-subtle pt-5">
        <span className="type-stat text-fg-brand">{overlapHours}h</span>
        <span className="flex flex-col">
          <span className="type-label-sm text-fg">
            {overlapHours > 0 ? 'live overlap every weekday' : 'no live overlap, async updates daily'}
          </span>
          <span className="type-caption font-normal text-fg-subtle">
            {standup ? `Daily standup at ${standup} ${city.label}` : 'Written update every evening, your time'}
          </span>
        </span>
      </output>
    </section>
  );
}
