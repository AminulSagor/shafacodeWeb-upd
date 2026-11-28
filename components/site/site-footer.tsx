import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';

import { IconButton } from '@/components/ui/icon-button';
import { LogoLink } from '@/components/site/logo';
import { FooterWordmark } from '@/components/site/footer-wordmark';
import { footerNav, site, type NavItem } from '@/content/site';
import { serviceHref, services } from '@/content/services';

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[18px]">
      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[18px]">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: NavItem[] }) {
  return (
    <div>
      <h2 className="type-eyebrow text-fg-subtle">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="rounded-sm type-body-sm text-fg-muted transition-colors hover:text-fg focus-visible:focus-ring"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Figma: Site Footer 16:2743 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line-subtle">
      <div className="container-page pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-3 xl:col-span-1 xl:pr-4">
            <LogoLink className="self-start" />
            <p className="max-w-sm type-body-sm text-fg-muted">{site.description}</p>
            <ul className="flex flex-col gap-3 type-body-sm text-fg-muted">
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 rounded-sm hover:text-fg focus-visible:focus-ring">
                  <Mail className="size-4 shrink-0 text-icon-brand" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-sm hover:text-fg focus-visible:focus-ring">
                  <MessageCircle className="size-4 shrink-0 text-icon-brand" aria-hidden />
                  WhatsApp: {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-icon-brand" aria-hidden />
                <span>
                  {site.address.locality}, {site.address.country} · Working with clients worldwide
                </span>
              </li>
            </ul>
            <div className="flex gap-2">
              <IconButton asChild aria-label="ShafaCode on LinkedIn" size="md">
                <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                </a>
              </IconButton>
              <IconButton asChild aria-label="ShafaCode on Facebook" size="md">
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon />
                </a>
              </IconButton>
            </div>
          </div>
          <FooterColumn title="Company" links={footerNav.company} />
          <FooterColumn
            title="Services"
            links={services.map((s) => ({ label: s.shortTitle, href: serviceHref(s.slug) }))}
          />
          <FooterColumn title="Get started" links={footerNav.getStarted} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line-subtle py-6 md:flex-row md:items-center md:justify-between">
          <p className="type-caption font-normal text-fg-subtle md:type-body-sm">
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-sm type-body-sm text-fg-subtle hover:text-fg focus-visible:focus-ring">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FooterWordmark />
    </footer>
  );
}
