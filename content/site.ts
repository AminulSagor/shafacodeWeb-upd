/**
 * Organisation facts used by the header, footer, contact page and JSON-LD.
 * Site Settings in the admin will override these once the settings screen ships.
 */
export const site = {
  name: 'ShafaCode',
  legalName: 'ShafaCode',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shafacode.com',
  tagline: 'Transparent software partner for growing teams',
  description:
    'ShafaCode builds high-performance websites, mobile apps, SaaS platforms and custom software for growing businesses, with clean design and scalable engineering.',
  email: 'hello@shafacode.com',
  phone: '+8801540233587',
  phoneDisplay: '+880 1540-233587',
  whatsapp: 'https://wa.me/8801540233587',
  address: {
    locality: 'Barishal',
    country: 'Bangladesh',
    countryCode: 'BD',
  },
  workingHours: { start: 10, end: 20, utcOffset: 6, label: '10:00 to 20:00 (GMT+6)' },
  social: {
    linkedin: 'https://www.linkedin.com/company/shafacodedotcom/',
    facebook: 'https://www.facebook.com/profile.php?id=61580938442647',
  },
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Packages', href: '/packages' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blogs' },
];

export const footerNav = {
  company: [
    { label: 'About us', href: '/about' },
    { label: 'Our process', href: '/services#process' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Careers', href: '/careers' },
    { label: 'Partner program', href: '/affiliate' },
    { label: 'Blog', href: '/blogs' },
  ],
  getStarted: [
    { label: 'Packages & pricing', href: '/packages' },
    { label: 'Contact us', href: '/contact' },
    { label: 'Request a quote', href: '/contact?type=quote' },
    { label: 'Book a consultation', href: '/contact?type=consultation' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Sitemap', href: '/sitemap.xml' },
  ],
} satisfies Record<string, NavItem[]>;
