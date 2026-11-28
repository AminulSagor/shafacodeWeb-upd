import type { LucideIcon } from 'lucide-react';
import { Cloud, Cpu, Globe, Monitor, PenTool, Smartphone, SquareTerminal } from 'lucide-react';

export const serviceSlugs = [
  'custom-software-development',
  'web-application-development',
  'mobile-app-development',
  'saas-development',
  'ui-ux-design',
  'wordpress-development',
  'iot-embedded-systems',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export type Service = {
  slug: ServiceSlug;
  /** Full name, used in headings and the mega menu */
  title: string;
  /** Short name for the footer */
  shortTitle: string;
  icon: LucideIcon;
  /** One line for the services index (Home, Services) */
  description: string;
  /** Shorter line for the mega menu */
  menuDescription: string;
  stack: readonly string[];
};

export const services: readonly Service[] = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    shortTitle: 'Custom Software',
    icon: SquareTerminal,
    description:
      'Internal tools, CRMs, dashboards, automation and custom workflows that help your team operate faster.',
    menuDescription: 'Internal tools, CRMs, dashboards and automation.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    slug: 'web-application-development',
    title: 'Web Application Development',
    shortTitle: 'Web Applications',
    icon: Monitor,
    description: 'Fast, secure portals, booking systems and business platforms.',
    menuDescription: 'Scalable portals and business platforms.',
    stack: ['React', 'Next.js', 'Firebase'],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    shortTitle: 'Mobile Apps',
    icon: Smartphone,
    description: 'Flutter and native apps with clean UI, smooth flows and launch-ready structure.',
    menuDescription: 'High-performance Flutter and native apps.',
    stack: ['Flutter', 'Firebase', 'REST API'],
  },
  {
    slug: 'saas-development',
    title: 'SaaS Development',
    shortTitle: 'SaaS Development',
    icon: Cloud,
    description:
      'Subscription platforms with user roles, billing flows, dashboards and a scalable multi-tenant architecture.',
    menuDescription: 'Subscription platforms with multi-tenant architecture.',
    stack: ['Next.js', 'Stripe', 'Cloud'],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    shortTitle: 'UI/UX Design',
    icon: PenTool,
    description: 'User flows, wireframes, prototypes and design systems that build trust.',
    menuDescription: 'Research, wireframes and prototypes built for usability.',
    stack: ['Figma', 'Prototyping', 'UX Research'],
  },
  {
    slug: 'wordpress-development',
    title: 'WordPress Development',
    shortTitle: 'WordPress',
    icon: Globe,
    description: 'Fast, SEO-friendly WordPress and WooCommerce sites that are easy to manage.',
    menuDescription: 'Fast, SEO-friendly sites with easy content management.',
    stack: ['WordPress', 'WooCommerce', 'SEO'],
  },
  {
    slug: 'iot-embedded-systems',
    title: 'IoT & Embedded Systems',
    shortTitle: 'IoT & Embedded',
    icon: Cpu,
    description: 'Firmware, sensors, gateways and real-time monitoring dashboards.',
    menuDescription: 'Firmware, sensors and real-time monitoring dashboards.',
    stack: ['ESP32', 'Raspberry Pi', 'MQTT'],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const serviceHref = (slug: ServiceSlug) => `/services/${slug}`;
