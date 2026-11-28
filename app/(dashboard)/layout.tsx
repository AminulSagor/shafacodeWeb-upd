import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import '../globals.css';
import { fontVariables } from '../fonts';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | ShafaCode admin' },
  robots: { index: false, follow: false },
};

/** Root layout of login and admin: light by default, admin density. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-ui="admin" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster theme="light" />
        </ThemeProvider>
      </body>
    </html>
  );
}
