import { Geist, Geist_Mono, Instrument_Sans, Instrument_Serif } from 'next/font/google';

/** Headlines: Geist SemiBold. */
export const geist = Geist({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-geist',
  display: 'swap',
});

/** The single lime accent phrase per heading. Small, so it is not preloaded. */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
  preload: false,
});

/** Body and UI. */
export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

/** Eyebrows, labels and data. */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
});

export const fontVariables = [
  geist.variable,
  instrumentSerif.variable,
  instrumentSans.variable,
  geistMono.variable,
].join(' ');
