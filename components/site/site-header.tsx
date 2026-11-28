'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogoLink } from '@/components/site/logo';
import { MegaMenu } from '@/components/site/mega-menu';
import { MobileMenu } from '@/components/site/mobile-menu';
import { mainNav } from '@/content/site';

export function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navLinkClass =
  'inline-flex h-9 items-center gap-1 rounded-button-sm px-3 type-label-sm text-fg-muted transition-colors hover:text-fg focus-visible:focus-ring aria-[current=page]:text-fg data-[state=open]:text-fg';

/**
 * Sticky site header: transparent over the hero, glass after 24px of scroll.
 * Services opens the mega menu on hover, focus or Enter; Escape closes and
 * returns focus. Figma: Site Header 64:4001, Services Mega Menu 16:2592
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-nav border-b transition-[background-color,border-color,backdrop-filter] duration-(--duration-base)',
        scrolled ? 'glass border-line-subtle' : 'border-line-subtle bg-canvas/0'
      )}
    >
      <div className="container-page flex h-full items-center justify-between gap-6">
        <LogoLink />

        <NavigationMenu.Root
          aria-label="Main"
          delayDuration={80}
          className="relative hidden xl:block"
        >
          <NavigationMenu.List className="flex items-center gap-1">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger
                className={cn(navLinkClass, 'group cursor-pointer')}
                aria-current={pathname.startsWith('/services') ? 'page' : undefined}
              >
                Services
                <ChevronDown
                  className="size-4 transition-transform duration-(--duration-fast) group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out">
                <MegaMenu />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            {mainNav.map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild active={isActivePath(pathname, item.href)}>
                  <Link
                    href={item.href}
                    className={navLinkClass}
                    aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>

          <div className="absolute top-[calc(100%+--spacing(3.5))] left-1/2 -translate-x-1/2">
            <NavigationMenu.Viewport className="origin-top transition-[width,height] duration-(--duration-fast) data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-[0.98] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-[0.98]" />
          </div>
        </NavigationMenu.Root>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className={cn(navLinkClass, 'hidden text-fg xl:inline-flex')}
            aria-current={isActivePath(pathname, '/contact') ? 'page' : undefined}
          >
            Contact
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/contact?type=project">
              Start a project
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
