import type { LucideIcon } from 'lucide-react';
import { Cloud, Cpu, Globe, Monitor, PenTool, Smartphone, Terminal } from 'lucide-react';

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
  /** Services page card */
  summary: string;
  highlights: readonly string[];
  exploreLabel: string;
};

export const services: readonly Service[] = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    shortTitle: 'Custom Software',
    icon: Terminal,
    description:
      'Internal tools, CRMs, dashboards, automation and custom workflows that help your team operate faster.',
    menuDescription: 'Internal tools, CRMs, dashboards and automation.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL'],
    summary:
      "Internal tools, CRMs, dashboards, automation systems and custom workflows that help businesses operate faster.",
    highlights: ["CRM systems", "Admin dashboards", "Business automation", "Internal management"],
    exploreLabel: "Explore custom software",
  },
  {
    slug: 'web-application-development',
    title: 'Web Application Development',
    shortTitle: 'Web Applications',
    icon: Monitor,
    description: 'Fast, secure portals, booking systems and business platforms.',
    menuDescription: 'Scalable portals and business platforms.',
    stack: ['React', 'Next.js', 'Firebase'],
    summary:
      "Fast, responsive and secure web apps for portals, booking systems, dashboards and business operations.",
    highlights: ["Client portals", "Booking platforms", "Admin panels", "Web dashboards"],
    exploreLabel: "Explore web apps",
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    shortTitle: 'Mobile Apps',
    icon: Smartphone,
    description: 'Flutter and native apps with clean UI, smooth flows and launch-ready structure.',
    menuDescription: 'High-performance Flutter and native apps.',
    stack: ['Flutter', 'Firebase', 'REST API'],
    summary:
      "Mobile apps with clean UI, smooth user flows, reliable performance, API integration and launch-ready structure.",
    highlights: ["Android & iOS apps", "Flutter apps", "Customer apps", "Service apps"],
    exploreLabel: "Explore mobile apps",
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
    summary:
      "SaaS platforms with user roles, subscriptions, dashboards, billing flows and scalable product architecture.",
    highlights: ["Subscription systems", "Multi-user platforms", "Role-based access", "Admin control panels"],
    exploreLabel: "Explore SaaS development",
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    shortTitle: 'UI/UX Design',
    icon: PenTool,
    description: 'User flows, wireframes, prototypes and design systems that build trust.',
    menuDescription: 'Research, wireframes and prototypes built for usability.',
    stack: ['Figma', 'Prototyping', 'UX Research'],
    summary:
      "User flows, wireframes, Figma prototypes, design systems and polished interfaces that improve usability.",
    highlights: ["Product wireframes", "Website & app UI", "Design systems", "Clickable prototypes"],
    exploreLabel: "Explore UI/UX design",
  },
  {
    slug: 'wordpress-development',
    title: 'WordPress Development',
    shortTitle: 'WordPress',
    icon: Globe,
    description: 'Fast, SEO-friendly WordPress and WooCommerce sites that are easy to manage.',
    menuDescription: 'Fast, SEO-friendly sites with easy content management.',
    stack: ['WordPress', 'WooCommerce', 'SEO'],
    summary:
      "Fast, responsive, SEO-friendly WordPress websites with easy content management.",
    highlights: ["Business websites", "Landing pages & blogs", "WooCommerce stores", "Custom themes"],
    exploreLabel: "Explore WordPress",
  },
  {
    slug: 'iot-embedded-systems',
    title: 'IoT & Embedded Systems',
    shortTitle: 'IoT & Embedded',
    icon: Cpu,
    description: 'Firmware, sensors, gateways and real-time monitoring dashboards.',
    menuDescription: 'Firmware, sensors and real-time monitoring dashboards.',
    stack: ['ESP32', 'Raspberry Pi', 'MQTT'],
    summary:
      "Devices, sensors, firmware, gateways and dashboards for monitoring and automation.",
    highlights: ["ESP32 systems", "Raspberry Pi solutions", "Sensor dashboards", "MQTT/HTTP data"],
    exploreLabel: "Explore IoT solutions",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const serviceHref = (slug: ServiceSlug) => `/services/${slug}`;
