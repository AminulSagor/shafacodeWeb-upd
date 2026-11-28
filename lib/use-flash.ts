'use client';

import * as React from 'react';

/** A boolean that turns on and resets after `ms`, with the timer cleared on re-trigger and unmount. */
export function useFlash(ms = 2000) {
  const [on, setOn] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const flash = React.useCallback(() => {
    window.clearTimeout(timer.current);
    setOn(true);
    timer.current = window.setTimeout(() => setOn(false), ms);
  }, [ms]);
  return [on, flash] as const;
}
