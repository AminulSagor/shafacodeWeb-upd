import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { Button } from '@/components/ui/button';
import { TextLink } from '@/components/ui/text-link';
import { serviceHref, services } from '@/content/services';

/** Figma: Services Mega Menu 16:2592 */
export function MegaMenu() {
  return (
    <div className="grid w-[914px] grid-cols-[1fr_1fr_252px] gap-x-6 rounded-panel border border-line bg-surface-1 p-3">
      <ul className="col-span-2 grid grid-cols-2 gap-x-2 gap-y-1 py-2 pl-2">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={serviceHref(s.slug)}
                  className="group flex gap-3.5 rounded-field p-3 transition-colors hover:bg-hover focus-visible:focus-ring"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-chip border border-brand-soft-border bg-brand-soft text-icon-brand">
                    <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="type-label text-fg">{s.title}</span>
                    <span className="type-body-sm text-fg-subtle">{s.menuDescription}</span>
                  </span>
                </Link>
              </NavigationMenu.Link>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col rounded-field border border-brand-soft-border bg-brand-soft p-5">
        <p className="type-h4 text-fg">Not sure which service fits?</p>
        <p className="mt-3 type-body text-fg-muted">
          Tell us the problem. We will suggest the right scope, timeline and budget.
        </p>
        <div className="mt-auto flex flex-col items-start gap-4 pt-6">
          <NavigationMenu.Link asChild>
            <Button asChild size="sm">
              <Link href="/contact?type=consultation">Book a free consultation</Link>
            </Button>
          </NavigationMenu.Link>
          <NavigationMenu.Link asChild>
            <TextLink href="/services">All services</TextLink>
          </NavigationMenu.Link>
        </div>
      </div>
    </div>
  );
}
