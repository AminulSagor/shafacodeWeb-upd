import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  ChartNoAxesColumn,
  Calendar,
  Cloud,
  Code,
  Cpu,
  Database,
  FileText,
  Folder,
  Globe,
  Layers,
  LayoutDashboard,
  PenTool,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Target,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

import { homeFaqs, type Faq } from '@/content/faq';
import type { ServiceSlug } from '@/content/services';

/** A heading with one serif accent phrase: `${before} {accent}${after}` */
export type AccentHeading = { before: string; accent: string; after?: string };

export type ServiceDetail = {
  eyebrow: string;
  title: AccentHeading;
  lede: string;
  primaryCta: string;
  secondaryCta: string;
  /** Facts strip: timeline and team differ per service */
  timeline: string;
  team: string;
  build: { title: AccentHeading; lede: string; items: { icon: LucideIcon; title: string; body: string }[] };
  bestFor: { lede: string; audiences: string[] };
  stack: { lede: string; items: string[] };
  process: { title: AccentHeading; lede: string; qaBody: string };
  related: { title: AccentHeading; linkLabel: string };
  faqTitle: AccentHeading;
  firstFaq: Faq;
  ctaTitle: AccentHeading;
  /** Metadata */
  metaTitle: string;
  metaDescription: string;
};

const BEST_FOR_DEFAULT = 'Teams that need a reliable product, not just a website.';

/** Copy from the Figma service frames (30:4583 and 53:8859 to 53:11345). */
export const serviceDetails: Record<ServiceSlug, ServiceDetail> = {
  'custom-software-development': {
    eyebrow: '01 · Custom software development',
    title: { before: 'Custom software built around', accent: 'your business workflow' },
    lede: 'We design and develop internal tools, CRMs, dashboards, automation systems and custom workflows that help businesses operate faster and more efficiently.',
    primaryCta: 'Discuss custom software',
    secondaryCta: 'See related case studies',
    timeline: '10 to 20 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'Custom software', accent: 'we build' },
      lede: 'From internal tools to automation and integrations, each system is planned around your team and the way it already works.',
      items: [
        { icon: LayoutDashboard, title: 'CRM systems', body: 'Customers, deals and follow-ups in one place.' },
        { icon: ChartNoAxesColumn, title: 'Admin dashboards', body: 'Live metrics and controls for your team.' },
        { icon: Zap, title: 'Business automation', body: 'Replace repetitive manual work with software.' },
        { icon: Folder, title: 'Internal management', body: 'Inventory, HR, approvals and records.' },
        { icon: Layers, title: 'Workflow platforms', body: 'Your exact process, digitised step by step.' },
        { icon: FileText, title: 'Reporting & analytics', body: 'Exports and reports that answer real questions.' },
      ],
    },
    bestFor: { lede: BEST_FOR_DEFAULT, audiences: ['SMEs', 'Growing businesses', 'Service companies', 'Operations teams'] },
    stack: {
      lede: 'Proven, well-supported tools chosen for reliability, security and long-term maintenance.',
      items: ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST API', 'Docker'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'launched custom tool' },
      lede: 'A typical build takes 10 to 20 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Testing, data checks and security review.',
    },
    related: { title: { before: 'Software we have', accent: 'shipped' }, linkLabel: 'All case studies' },
    faqTitle: { before: 'Custom Software Development', accent: 'questions' },
    firstFaq: {
      q: 'How long does custom software take?',
      a: 'Most custom systems take 10 to 20 weeks. A first internal tool can go live in 6 to 8 weeks; larger systems are delivered in phases.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your custom software', after: '?' },
    metaTitle: 'Custom software development',
    metaDescription:
      'Internal tools, CRMs, dashboards and automation built around your workflow, with fixed milestones and full code ownership.',
  },
  'web-application-development': {
    eyebrow: '02 · Web application development',
    title: { before: 'Scalable web applications for', accent: 'modern businesses' },
    lede: 'We build fast, responsive and secure web applications for portals, booking systems, dashboards, SaaS platforms and business operations, with milestones you can see.',
    primaryCta: 'Build a web app',
    secondaryCta: 'See web app case studies',
    timeline: '8 to 16 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'Web apps we', accent: 'design, build and support' },
      lede: 'From customer-facing portals to internal operations tools, each product is planned around your users and your workflow.',
      items: [
        { icon: Users, title: 'Client portals', body: 'Secure self-service areas for customers, partners and members.' },
        { icon: Calendar, title: 'Booking platforms', body: 'Scheduling, availability, payments and reminders in one flow.' },
        { icon: LayoutDashboard, title: 'Admin panels', body: 'Role-based tools to manage content, orders and operations.' },
        { icon: Globe, title: 'Business websites', body: 'Fast marketing sites with a CMS your team can update.' },
        { icon: ChartNoAxesColumn, title: 'Web dashboards', body: 'Live metrics and reports that turn data into decisions.' },
        { icon: Cloud, title: 'SaaS platforms', body: 'Multi-tenant products with subscriptions and billing.' },
      ],
    },
    bestFor: { lede: BEST_FOR_DEFAULT, audiences: ['Startups', 'SaaS founders', 'Agencies', 'Service businesses'] },
    stack: {
      lede: 'Modern, well-supported tools chosen for speed, SEO and long-term maintenance.',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'REST API'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'launched web app' },
      lede: 'A typical build takes 8 to 16 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Testing, Core Web Vitals and security checks.',
    },
    related: { title: { before: 'Web apps we have', accent: 'shipped' }, linkLabel: 'All web app case studies' },
    faqTitle: { before: 'Web app development', accent: 'questions' },
    firstFaq: {
      q: 'How long does a web app take?',
      a: 'Most web apps take 8 to 16 weeks. Simple portals can launch in 6 weeks; complex platforms are delivered in phases.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your web app', after: '?' },
    metaTitle: 'Web application development',
    metaDescription:
      'Fast, secure web apps for portals, booking systems, dashboards and SaaS, built in 8 to 16 weeks with milestones you can see.',
  },
  'mobile-app-development': {
    eyebrow: '03 · Mobile app development',
    title: { before: 'Mobile apps designed for', accent: 'real users' },
    lede: 'Mobile apps with clean UI, smooth user flows, reliable performance, API integration and a launch-ready structure for Google Play and the App Store.',
    primaryCta: 'Start an app project',
    secondaryCta: 'See related case studies',
    timeline: '10 to 16 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'Mobile apps', accent: 'we build' },
      lede: 'From customer apps to field and delivery tools, each app is planned around your users, devices and store requirements.',
      items: [
        { icon: Smartphone, title: 'Android & iOS apps', body: 'One Flutter codebase, native feel.' },
        { icon: Users, title: 'Customer apps', body: 'Accounts, orders, tracking and support.' },
        { icon: Calendar, title: 'Service & booking apps', body: 'Schedules, reminders and payments.' },
        { icon: LayoutDashboard, title: 'App dashboards', body: 'Admin panels to run the app.' },
        { icon: Bell, title: 'Push notifications', body: 'Timely updates that bring users back.' },
        { icon: Wallet, title: 'Payments', body: 'bKash, SSLCommerz and Stripe flows.' },
      ],
    },
    bestFor: { lede: BEST_FOR_DEFAULT, audiences: ['Startups', 'Local businesses', 'Service providers', 'Digital platforms'] },
    stack: {
      lede: 'Modern, well-supported tools chosen for smooth performance, store approval and long-term maintenance.',
      items: ['Flutter', 'Firebase', 'REST API', 'Google Play', 'App Store', 'Figma'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'launched mobile app' },
      lede: 'A typical build takes 10 to 16 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Device testing, performance and store review checks.',
    },
    related: { title: { before: 'Mobile apps we have', accent: 'shipped' }, linkLabel: 'All case studies' },
    faqTitle: { before: 'Mobile App Development', accent: 'questions' },
    firstFaq: {
      q: 'How long does a mobile app take?',
      a: 'Most mobile apps take 10 to 16 weeks, including store review. A focused first version can launch in about 8 weeks.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your mobile app', after: '?' },
    metaTitle: 'Mobile app development',
    metaDescription:
      'Flutter and native mobile apps with clean UI, smooth flows, payments and push notifications, ready for Google Play and the App Store.',
  },
  'saas-development': {
    eyebrow: '04 · SaaS development',
    title: { before: 'Launch your SaaS on a', accent: 'scalable foundation' },
    lede: 'SaaS platforms with user roles, subscriptions, dashboards, billing flows, admin systems and a product architecture that grows with you.',
    primaryCta: 'Plan your SaaS',
    secondaryCta: 'See related case studies',
    timeline: '12 to 24 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'SaaS products', accent: 'we build' },
      lede: 'From the first paying customer to thousands of accounts, each product is planned around your users, plans and growth.',
      items: [
        { icon: ChartNoAxesColumn, title: 'SaaS dashboards', body: 'Clear, fast product analytics.' },
        { icon: Wallet, title: 'Subscriptions', body: 'Plans, trials, invoices and dunning.' },
        { icon: Users, title: 'Multi-user platforms', body: 'Teams, invites and workspaces.' },
        { icon: LayoutDashboard, title: 'Admin control panels', body: 'Support and operations tools.' },
        { icon: ShieldCheck, title: 'Role-based access', body: 'Permissions that match your org.' },
        { icon: Database, title: 'Usage analytics', body: 'Events and metrics you can act on.' },
      ],
    },
    bestFor: { lede: BEST_FOR_DEFAULT, audiences: ['SaaS founders', 'Product teams', 'Startups', 'Subscription businesses'] },
    stack: {
      lede: 'Modern, well-supported tools chosen for multi-tenant scale, billing and long-term maintenance.',
      items: ['Next.js', 'Node.js', 'Stripe', 'PostgreSQL', 'TypeScript', 'Cloud'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'launched SaaS product' },
      lede: 'A typical build takes 12 to 24 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Load testing, billing flows and security checks.',
    },
    related: { title: { before: 'SaaS products we have', accent: 'shipped' }, linkLabel: 'All case studies' },
    faqTitle: { before: 'SaaS Development', accent: 'questions' },
    firstFaq: {
      q: 'How long does a SaaS product take?',
      a: 'Most SaaS products reach a paid first version in 12 to 24 weeks, then grow in monthly releases.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your SaaS', after: '?' },
    metaTitle: 'SaaS development',
    metaDescription:
      'SaaS platforms with roles, subscriptions, billing, dashboards and a multi-tenant architecture that grows with your product.',
  },
  'ui-ux-design': {
    eyebrow: '05 · UI/UX design',
    title: { before: 'UI/UX design that makes products', accent: 'easier to use' },
    lede: 'User flows, wireframes, Figma prototypes, design systems and polished interfaces that improve usability and build trust.',
    primaryCta: 'Design your product',
    secondaryCta: 'See related case studies',
    timeline: '3 to 8 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'Design work', accent: 'we do' },
      lede: 'From early wireframes to full design systems, each project is planned around real users and what your team can build.',
      items: [
        { icon: Layers, title: 'Product wireframes', body: 'Structure before pixels.' },
        { icon: Globe, title: 'Website UI design', body: 'Fast, on-brand marketing sites.' },
        { icon: Smartphone, title: 'Mobile app UI', body: 'Native patterns, delightful details.' },
        { icon: PenTool, title: 'Design systems', body: 'Tokens and components your devs love.' },
        { icon: Target, title: 'Clickable prototypes', body: 'Test ideas before you build.' },
        { icon: Search, title: 'UX research & testing', body: 'Interviews, usability tests, insights.' },
      ],
    },
    bestFor: { lede: BEST_FOR_DEFAULT, audiences: ['Startups', 'Apps', 'SaaS products', 'Redesign projects'] },
    stack: {
      lede: 'Industry-standard tools chosen for fast iteration, clean handoff and long-term consistency.',
      items: ['Figma', 'Prototyping', 'Design systems', 'UX research', 'Branding', 'FigJam'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'tested, shippable design' },
      lede: 'A typical project takes 3 to 8 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Usability testing and accessibility review.',
    },
    related: { title: { before: 'Designs we have', accent: 'shipped' }, linkLabel: 'All case studies' },
    faqTitle: { before: 'UI/UX Design', accent: 'questions' },
    firstFaq: {
      q: 'How long does a design project take?',
      a: 'Most UI/UX projects take 3 to 8 weeks from research to a tested, clickable prototype and developer handoff.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your product design', after: '?' },
    metaTitle: 'UI/UX design',
    metaDescription:
      'User flows, wireframes, Figma prototypes and design systems that make products easier to use and simpler to build.',
  },
  'wordpress-development': {
    eyebrow: '06 · WordPress development',
    title: { before: 'Professional WordPress websites that are', accent: 'easy to manage' },
    lede: 'Fast, responsive, SEO-friendly WordPress websites for businesses that need a professional online presence with easy content management.',
    primaryCta: 'Build a WordPress website',
    secondaryCta: 'See related case studies',
    timeline: '3 to 6 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'WordPress sites', accent: 'we build' },
      lede: 'From marketing sites to WooCommerce stores, each site is planned around your content, customers and search visibility.',
      items: [
        { icon: Globe, title: 'Business websites', body: 'Credible, fast and easy to update.' },
        { icon: Folder, title: 'Portfolio & corporate', body: 'Show work, team and services.' },
        { icon: FileText, title: 'Landing pages & blogs', body: 'Campaign pages that convert.' },
        { icon: Wallet, title: 'WooCommerce stores', body: 'Products, payments and orders.' },
        { icon: Code, title: 'Custom themes', body: 'No bloated page builders required.' },
        { icon: Zap, title: 'SEO & speed', body: 'Core Web Vitals and technical SEO.' },
      ],
    },
    bestFor: { lede: BEST_FOR_DEFAULT, audiences: ['Small businesses', 'Personal brands', 'Agencies', 'eCommerce'] },
    stack: {
      lede: 'Modern, well-supported tools chosen for speed, SEO and easy content management.',
      items: ['WordPress', 'WooCommerce', 'Elementor', 'PHP', 'SEO', 'Cloudflare'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'launched WordPress site' },
      lede: 'A typical build takes 3 to 6 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Speed, SEO and security checks.',
    },
    related: { title: { before: 'Sites we have', accent: 'shipped' }, linkLabel: 'All case studies' },
    faqTitle: { before: 'WordPress Development', accent: 'questions' },
    firstFaq: {
      q: 'How long does a WordPress site take?',
      a: 'Most WordPress sites take 3 to 6 weeks. WooCommerce stores with custom features take 6 to 10 weeks.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your WordPress website', after: '?' },
    metaTitle: 'WordPress development',
    metaDescription:
      'Fast, SEO-friendly WordPress and WooCommerce websites with custom themes and easy content management.',
  },
  'iot-embedded-systems': {
    eyebrow: '07 · IoT & embedded systems',
    title: { before: 'IoT solutions that connect', accent: 'devices, data and dashboards' },
    lede: 'IoT systems using devices, sensors, firmware, gateways, data communication and dashboards for monitoring and automation.',
    primaryCta: 'Discuss an IoT project',
    secondaryCta: 'See related case studies',
    timeline: '8 to 16 weeks',
    team: 'PM, designer, 2 to 3 engineers',
    build: {
      title: { before: 'IoT systems', accent: 'we build' },
      lede: 'From a single sensor to a fleet of connected devices, each system is planned around your hardware, data and workflow.',
      items: [
        { icon: Cpu, title: 'ESP32 systems', body: 'Low-power firmware and sensors.' },
        { icon: Server, title: 'Raspberry Pi solutions', body: 'Edge gateways and local processing.' },
        { icon: ChartNoAxesColumn, title: 'Sensor dashboards', body: 'Live readings, trends and history.' },
        { icon: LayoutDashboard, title: 'Monitoring panels', body: 'Status of every device at a glance.' },
        { icon: Database, title: 'MQTT/HTTP data', body: 'Reliable device-to-cloud pipelines.' },
        { icon: Bell, title: 'Alerts & automation', body: 'Rules that act when values change.' },
      ],
    },
    bestFor: {
      lede: 'Teams that need devices, data and dashboards that work together.',
      audiences: ['Automation projects', 'Hardware startups', 'Monitoring systems', 'Smart devices'],
    },
    stack: {
      lede: 'Proven hardware and protocols chosen for reliability, low power use and long-term maintenance.',
      items: ['ESP32', 'Raspberry Pi', 'MQTT', 'HTTP', 'Node.js', 'Firebase'],
    },
    process: {
      title: { before: 'From idea to a', accent: 'connected IoT system' },
      lede: 'A typical build takes 8 to 16 weeks. We adjust the plan to your scope before work starts.',
      qaBody: 'Field testing, power use and security checks.',
    },
    related: { title: { before: 'Systems we have', accent: 'shipped' }, linkLabel: 'All case studies' },
    faqTitle: { before: 'IoT & Embedded Systems', accent: 'questions' },
    firstFaq: {
      q: 'How long does an IoT project take?',
      a: 'Most IoT projects take 8 to 16 weeks, including a hardware prototype, firmware and the monitoring dashboard.',
    },
    ctaTitle: { before: 'Ready to build', accent: 'your IoT system', after: '?' },
    metaTitle: 'IoT and embedded systems',
    metaDescription:
      'ESP32 and Raspberry Pi devices, firmware, MQTT pipelines and monitoring dashboards for automation and smart products.',
  },
};

/** Steps 01 to 04 and 06 are shared; step 05 (QA) is service-specific. */
export function serviceSteps(detail: ServiceDetail) {
  return [
    { title: 'Discovery & scope', body: 'Requirements, user roles and a fixed estimate.', time: 'Week 1' },
    { title: 'UX & architecture', body: 'User flows, data model and API plan.', time: 'Week 2' },
    { title: 'UI design & prototype', body: 'Clickable prototype tested with real users.', time: 'Week 3 to 4' },
    { title: 'Development sprints', body: 'Two-week sprints with a demo after each.', time: 'Week 5 to 10' },
    { title: 'QA & performance', body: detail.process.qaBody, time: 'Week 11' },
    { title: 'Launch & handover', body: 'Deployment, training and 30 days of support.', time: 'Week 12' },
  ];
}

export function serviceFaqs(detail: ServiceDetail): Faq[] {
  return [detail.firstFaq, homeFaqs[1], homeFaqs[2], homeFaqs[3], homeFaqs[4]];
}
