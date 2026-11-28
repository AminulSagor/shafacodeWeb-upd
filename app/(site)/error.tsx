'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center gap-6 section-y">
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="max-w-2xl type-h1 text-fg">This page failed to load.</h1>
      <p className="max-w-xl type-body-lg text-fg-muted">
        Please try again. If it keeps happening, write to us and we will look into it.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw aria-hidden /> Try again
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
