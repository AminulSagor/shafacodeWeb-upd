import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Linkedin } from 'lucide-react';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/#why-us' },
      { label: 'Our Process', href: '/#process' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Careers', href: '/careers' },
      { label: 'Partner Program', href: '/affiliate' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Custom Software', href: '/#services' },
      { label: 'Web Application', href: '/#services' },
      { label: 'Mobile Apps', href: '/#services' },
      { label: 'SaaS Solutions', href: '/#services' },
      { label: 'UI/UX Design', href: '/#services' },
      { label: 'Wordpress Development', href: '/#services' },
      { label: 'IoT Development', href: '/#services' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact Us', href: '/#contact' },
      { label: 'Request Quote', href: '/#contact' },
      { label: 'Blog', href: '/blogs' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0b0d0c] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/logo.png"
                alt="ShafaCode Logo"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
              <span className="text-xl font-semibold text-white">
                shafacode
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              ShafaCode builds high performance websites, mobile apps, SaaS
              platforms, and custom software for growing businesses. We combine
              clean design, transparent development, and scalable engineering
              to turn ideas into reliable digital products.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.linkedin.com/company/shafacodedotcom/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-200 transition-colors hover:bg-brand hover:text-black"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61580938442647"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-200 transition-colors hover:bg-brand hover:text-black"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} ShafaCode. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-brand">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-brand">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
