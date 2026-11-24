'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Packages', href: '/#pricing' },
  { label: 'Career', href: '/careers' },
  { label: 'Blog', href: '/blogs' },
];

const isActiveLink = (pathname: string, href: string) =>
  href === '/'
    ? pathname === '/'
    : !href.includes('#') &&
      (pathname === href || pathname.startsWith(href));

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    // h-0 + sticky: the bar floats over the page instead of pushing content down
    <header className="sticky top-0 z-50 h-0">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/logo.png"
              alt="ShafaCode Logo"
              width={40}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <span className="text-lg font-semibold leading-none text-white">
              shafacode
            </span>
          </Link>

          <nav className="hidden md:block" aria-label="Main">
            <ul className="flex items-center gap-8 text-sm">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-slate-200 transition-colors hover:text-brand',
                      isActiveLink(pathname, item.href) && 'text-brand'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            asChild
            className="hidden rounded-lg bg-brand px-5 font-semibold text-black shadow-[0_0_20px_-4px_var(--color-brand)] hover:bg-brand/90 md:inline-flex"
          >
            <Link href="/#contact">Start a Project</Link>
          </Button>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 border-white/10 bg-surface text-white [&>button]:hidden"
              >
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-white">
                        shafacode
                      </span>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetTitle>

                  <nav className="mt-4" aria-label="Mobile">
                    <ul className="flex flex-col gap-1 text-sm font-medium">
                      {navLinks.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              'block rounded-md px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-brand',
                              isActiveLink(pathname, item.href) &&
                                'bg-white/5 text-brand'
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="mt-4 border-t border-white/10 px-2 pt-4 text-sm">
                    <Button
                      asChild
                      className="w-full bg-brand font-semibold text-black hover:bg-brand/90"
                    >
                      <Link href="/#contact" onClick={() => setOpen(false)}>
                        Start a Project
                      </Link>
                    </Button>
                    <p className="mb-1 mt-4 font-medium text-slate-300">
                      Call Us:
                    </p>
                    <Link
                      href="tel:+8801540233587"
                      className="font-semibold text-brand"
                      onClick={() => setOpen(false)}
                    >
                      +8801540233587
                    </Link>
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
