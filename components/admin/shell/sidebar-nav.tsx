'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import { adminNav, isActive, type CountKey } from './nav';
import { Avatar, UserMenu, type ShellUser } from './user-menu';

export type NavCounts = Partial<Record<CountKey, number>>;

/** Navigation groups, live-site link and account card. Used by the desktop sidebar and the mobile drawer. */
export function SidebarNav({
  counts,
  user,
  collapsed = false,
  onNavigate,
}: {
  counts: NavCounts;
  user: ShellUser;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-4">
        {adminNav.map((group) => (
          <div key={group.label} className="mt-4 first:mt-1">
            <p className={cn('px-3 pb-1.5 type-mono-xs text-fg-subtle', collapsed && 'sr-only')}>{group.label}</p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item, pathname);
                const count = item.count ? counts[item.count] : undefined;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex h-10 items-center gap-2.5 rounded-button-sm pr-2.5 pl-3 type-label-sm transition-colors focus-visible:focus-ring',
                        active ? 'bg-surface-3 text-fg' : 'text-fg-muted hover:bg-hover hover:text-fg',
                        collapsed && 'justify-center px-0'
                      )}
                    >
                      <item.icon className="size-4.5 shrink-0" strokeWidth={1.75} aria-hidden />
                      <span className={cn('min-w-0 flex-1 truncate', collapsed && 'sr-only')}>{item.label}</span>
                      {!!count && (
                        <span
                          className={cn(
                            'grid h-5 min-w-6 place-items-center rounded-full bg-surface-2 px-1.5 type-caption text-fg-muted tabular',
                            collapsed && 'sr-only'
                          )}
                        >
                          {count}
                          <span className="sr-only"> new</span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="flex flex-col gap-3 border-t border-line-subtle p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? 'View live site' : undefined}
          className={cn(
            'flex h-10 items-center gap-2.5 rounded-button-sm px-3 type-label-sm text-fg-muted hover:bg-hover hover:text-fg focus-visible:focus-ring',
            collapsed && 'justify-center px-0'
          )}
        >
          <ExternalLink className="size-4.5" strokeWidth={1.75} aria-hidden />
          <span className={cn(collapsed && 'sr-only')}>View live site</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <UserMenu
          user={user}
          align="start"
          trigger={
            <button
              type="button"
              className={cn(
                'flex items-center gap-2.5 rounded-field border border-line-subtle bg-surface-1 p-2.5 text-left hover:bg-hover focus-visible:focus-ring',
                collapsed && 'justify-center border-0 p-1'
              )}
            >
              <Avatar name={user.name} />
              <span className={cn('flex min-w-0 flex-1 flex-col', collapsed && 'sr-only')}>
                <span className="truncate type-label-sm text-fg">{user.name}</span>
                <span className="type-caption font-normal text-fg-subtle capitalize">{user.role}</span>
              </span>
              <ChevronsUpDown className={cn('size-4 text-icon', collapsed && 'hidden')} aria-hidden />
              <span className="sr-only">Account menu</span>
            </button>
          }
        />
      </div>
    </div>
  );
}
