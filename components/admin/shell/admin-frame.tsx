'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Menu, PanelLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/site/logo';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { CommandMenu } from './command-menu';
import { CreateMenu } from './create-menu';
import { locate } from './nav';
import { SidebarNav, type NavCounts } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';
import { Avatar, UserMenu, type ShellUser } from './user-menu';

const SIDEBAR_COOKIE = 'sc_sidebar';

function Crumbs() {
  const pathname = usePathname();
  const hit = locate(pathname);
  const rest = hit ? pathname.slice(hit.item.href.length).split('/').filter(Boolean) : [];
  const tail = rest[0] === 'new' ? 'New' : rest.length ? (hit?.item.href === '/admin/applications' ? 'Details' : 'Edit') : null;
  const items = [
    { label: 'Admin', href: '/admin' },
    ...(hit ? [{ label: hit.group.label }, { label: hit.item.label, href: tail ? hit.item.href : undefined }] : []),
    ...(tail ? [{ label: tail }] : []),
  ];
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 max-md:hidden">
      <ol className="flex items-center gap-2 type-body-sm text-fg-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className={cn('flex min-w-0 items-center gap-2', !last && 'max-xl:hidden')}>
              {c.href && !last ? (
                <Link href={c.href} className="truncate rounded-sm hover:text-fg focus-visible:focus-ring">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn('truncate', last && 'text-fg')}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 shrink-0 text-icon-muted" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Admin chrome: 240px sidebar (collapsible to icons, remembered in a cookie),
 * topbar with breadcrumbs, search, create, theme, notifications and account.
 * Below 1024px the sidebar is a drawer. Figma: Dashboard 55:2655, drawer 62:10974
 */
export function AdminFrame({
  user,
  counts,
  initialCollapsed,
  children,
}: {
  user: ShellUser;
  counts: NavCounts;
  initialCollapsed: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(initialCollapsed);
  const [drawer, setDrawer] = React.useState(false);
  const unread = (counts.inquiries ?? 0) + (counts.applications ?? 0) + (counts.affiliateLeads ?? 0);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? 'collapsed' : 'open'}; path=/admin; max-age=31536000; samesite=lax`;
  };

  return (
    <div className="min-h-dvh bg-canvas text-fg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-button-sm focus:bg-surface-1 focus:px-4 focus:py-2 focus:focus-ring">
        Skip to content
      </a>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line-subtle bg-surface-1 transition-[width] duration-(--duration-base) lg:flex',
          collapsed ? 'w-18' : 'w-60'
        )}
      >
        <div className={cn('flex h-15 shrink-0 items-center justify-between px-5', collapsed && 'justify-center px-0')}>
          {!collapsed && (
            <Link href="/admin" aria-label="Admin dashboard" className="rounded-sm focus-visible:focus-ring">
              <Logo />
            </Link>
          )}
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="grid size-8 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring"
          >
            <PanelLeft className="size-4" aria-hidden />
          </button>
        </div>
        <SidebarNav counts={counts} user={user} collapsed={collapsed} />
      </aside>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent
          side="left"
          className="gap-0 p-0 lg:hidden"
          onOpenAutoFocus={(e) => {
            // Radix skips links when it picks the first element; start on the current page instead.
            const current = (e.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>('[aria-current="page"]');
            if (current) {
              e.preventDefault();
              current.focus();
            }
          }}
        >
          <div className="flex h-15 shrink-0 items-center px-5">
            <Logo />
          </div>
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SheetDescription className="sr-only">Screens of the ShafaCode admin</SheetDescription>
          <SidebarNav counts={counts} user={user} onNavigate={() => setDrawer(false)} />
        </SheetContent>
      </Sheet>

      <div className={cn('flex min-h-dvh flex-col transition-[padding] duration-(--duration-base)', collapsed ? 'lg:pl-18' : 'lg:pl-60')}>
        <header className="sticky top-0 z-20 flex h-15 items-center gap-3 border-b border-line-subtle bg-canvas/90 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open navigation"
            className="grid size-10 place-items-center rounded-button-sm text-icon hover:bg-hover focus-visible:focus-ring lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <Link href="/admin" aria-label="Admin dashboard" className="rounded-sm focus-visible:focus-ring md:hidden">
            <Logo />
          </Link>
          <Crumbs />
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden w-70 md:block">
              <CommandMenu />
            </div>
            <div className="max-sm:hidden">
              <CreateMenu />
            </div>
            <div className="max-sm:hidden">
              <ThemeToggle />
            </div>
            <Link
              href="/admin/inquiries?status=new"
              aria-label={unread ? `Notifications, ${unread} new` : 'Notifications'}
              className="relative grid size-10 place-items-center rounded-button-sm text-icon hover:bg-hover hover:text-icon-strong focus-visible:focus-ring"
            >
              <Bell className="size-4.5" strokeWidth={1.75} aria-hidden />
              {!!unread && <span aria-hidden className="absolute top-2 right-2.5 size-2 rounded-full bg-action-danger ring-2 ring-canvas" />}
            </Link>
            <UserMenu
              user={user}
              trigger={
                <button type="button" aria-label="Account menu" className="rounded-full focus-visible:focus-ring">
                  <Avatar name={user.name} />
                </button>
              }
            />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 px-4 py-6 outline-none md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
