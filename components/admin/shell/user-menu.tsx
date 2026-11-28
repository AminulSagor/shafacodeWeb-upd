'use client';

import * as React from 'react';
import { LogOut, MonitorX } from 'lucide-react';
import { useTheme } from 'next-themes';

import { signOut, signOutEverywhere } from '@/actions/auth';
import { initials } from '@/lib/admin/format';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ShellUser = { name: string; email: string; role: 'owner' | 'editor' };

export function Avatar({ name, className = 'size-9' }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-inverse type-label-xs text-fg-inverse ${className}`}>
      {initials(name)}
    </span>
  );
}

/** Account menu: sign out here or on every device. */
export function UserMenu({ user, trigger, align = 'end' }: { user: ShellUser; trigger: React.ReactNode; align?: 'start' | 'end' }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5 normal-case">
          <span className="type-label-sm text-fg">{user.name}</span>
          <span className="truncate type-caption font-normal text-fg-subtle">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={resolvedTheme === 'dark'} onCheckedChange={(on) => setTheme(on ? 'dark' : 'light')}>
          Dark theme
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut aria-hidden /> Sign out
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void signOutEverywhere()}>
          <MonitorX aria-hidden /> Sign out on all devices
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
