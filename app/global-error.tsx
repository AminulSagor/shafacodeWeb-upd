'use client';

import './globals.css';

/** Last-resort error page: renders its own <html> and <body>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" data-theme="dark" data-ui="site">
      <body>
        <main id="main" className="container-page flex min-h-dvh flex-col items-start justify-center gap-6">
          <h1 className="type-h2 text-fg">Something went wrong.</h1>
          <p className="type-body-lg text-fg-muted">Please reload the page or try again in a minute.</p>
          <button
            type="button"
            onClick={reset}
            className="h-11 rounded-[12px] bg-action-primary px-5 type-label text-fg-on-brand shadow-btn-primary focus-visible:focus-ring"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
