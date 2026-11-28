'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ArrowRight, Mail, Menu, MessageCircle, Minus, Phone, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Logo } from '@/components/site/logo';
import { mainNav, site } from '@/content/site';
import { serviceHref, services } from '@/content/services';

const rowClass =
  'flex min-h-14 w-full items-center justify-between border-b border-line-subtle py-4 type-h5 text-fg focus-visible:focus-ring aria-[current=page]:text-fg-brand';

/**
 * Full-height sheet from the right: logo, close button, services as an
 * accordion, CTA pinned at the bottom with call, WhatsApp and email.
 * Figma: Mobile Menu 16:2678, overlay 66:18779
 */
export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(pathname.startsWith('/services'));

  // Close when the route changes (a link inside was followed).
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  const current = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton aria-label="Open menu" size="md" className="xl:hidden">
          <Menu aria-hidden />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in xl:hidden" />
        <Dialog.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-canvas md:max-w-[420px] md:border-l md:border-line-subtle xl:hidden',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
            'duration-[var(--duration-base)] ease-out'
          )}
          aria-describedby={undefined}
        >
          <div className="flex h-[var(--nav-height)] shrink-0 items-center justify-between border-b border-line-subtle px-[var(--page-margin)]">
            <Link href="/" onClick={() => setOpen(false)} className="rounded-sm focus-visible:focus-ring">
              <Logo />
            </Link>
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton aria-label="Close menu">
                <X aria-hidden />
              </IconButton>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-[var(--page-margin)] pt-2 pb-6">
            <Collapsible.Root open={servicesOpen} onOpenChange={setServicesOpen}>
              <Collapsible.Trigger className={cn(rowClass, 'cursor-pointer')}>
                Services
                {servicesOpen ? (
                  <Minus className="size-5 text-icon" aria-hidden />
                ) : (
                  <Plus className="size-5 text-icon" aria-hidden />
                )}
              </Collapsible.Trigger>
              <Collapsible.Content className="overflow-hidden border-b border-line-subtle data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <ul className="flex flex-col py-2">
                  <li>
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      aria-current={pathname === '/services' ? 'page' : undefined}
                      className="flex min-h-11 items-center type-label text-fg-muted focus-visible:focus-ring aria-[current=page]:text-fg-brand"
                    >
                      All services
                    </Link>
                  </li>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={serviceHref(s.slug)}
                        onClick={() => setOpen(false)}
                        aria-current={current(serviceHref(s.slug))}
                        className="flex min-h-11 items-center gap-3 type-label text-fg-muted focus-visible:focus-ring aria-[current=page]:text-fg-brand"
                      >
                        <s.icon className="size-[18px] text-icon-brand" strokeWidth={1.75} aria-hidden />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapsible.Content>
            </Collapsible.Root>
            <ul>
              {[...mainNav, { label: 'Contact', href: '/contact' }].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={current(item.href)}
                    className={rowClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-line-subtle px-[var(--page-margin)] pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <Button asChild size="lg" className="w-full">
              <Link href="/contact?type=project" onClick={() => setOpen(false)}>
                Start a project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <ul className="mt-3 flex items-center justify-center gap-1">
              <li>
                <a href={`tel:${site.phone}`} className="inline-flex min-h-11 items-center gap-1.5 px-2.5 type-label-sm text-fg-muted hover:text-fg focus-visible:focus-ring">
                  <Phone className="size-4" aria-hidden /> Call
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 px-2.5 type-label-sm text-fg-muted hover:text-fg focus-visible:focus-ring">
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-1.5 px-2.5 type-label-sm text-fg-muted hover:text-fg focus-visible:focus-ring">
                  <Mail className="size-4" aria-hidden /> Email
                </a>
              </li>
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
