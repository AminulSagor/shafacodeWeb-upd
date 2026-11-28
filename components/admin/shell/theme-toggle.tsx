'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

/** Light by default; the dark toggle is optional (spec section 10). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  return (
    <button
      type="button"
      aria-label="Dark theme"
      aria-pressed={dark}
      suppressHydrationWarning
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="grid size-10 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring"
    >
      <Moon className="size-4.5 dark:hidden" strokeWidth={1.75} aria-hidden />
      <Sun className="hidden size-4.5 dark:block" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
