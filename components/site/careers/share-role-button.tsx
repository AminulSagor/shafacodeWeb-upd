'use client';

import { Check, Share2 } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { useFlash } from '@/lib/use-flash';

/** Native share sheet where available, otherwise copies the link. */
export function ShareRoleButton({ url, title, label = 'Share role', ...props }: { url: string; title: string; label?: string } & ButtonProps) {
  const [copied, flash] = useFlash();
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash();
    } catch {
      /* dismissed */
    }
  };
  return (
    <>
      <Button type="button" onClick={share} {...props}>
        {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
        {copied ? 'Link copied' : label}
      </Button>
      <span role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </>
  );
}
