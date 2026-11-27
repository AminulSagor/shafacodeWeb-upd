import {
  Cloud,
  Globe,
  LayoutPanelTop,
  Router,
  Ruler,
  Smartphone,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react';

// NOTE: placeholder names from the design mock. Replace with real client logos.
export const trustedBrands = [
  'VERTEX',
  'QUANTUM',
  'NEXUS',
  'AETHER',
  'ZENITH',
];

export const services: {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Custom Software Development',
    description: 'Internal tools, dashboards, and automation systems.',
    cta: 'Explore Custom Software Development',
    href: '/#contact',
    icon: SquareTerminal,
  },
  {
    title: 'Web Application Development',
    description: 'Responsive and scalable portals and business platforms.',
    cta: 'Explore Web Application Development',
    href: '/#contact',
    icon: LayoutPanelTop,
  },
  {
    title: 'Mobile App Development',
    description: 'High performance Flutter and native apps.',
    cta: 'Explore Mobile App Development',
    href: '/#contact',
    icon: Smartphone,
  },
  {
    title: 'SaaS Development',
    description: 'Subscription platforms with multi user architecture.',
    cta: 'Explore SaaS Development',
    href: '/#contact',
    icon: Cloud,
  },
  {
    title: 'UI/UX Design',
    description: 'Wireframes and prototypes built for usability.',
    cta: 'Explore UI/UX Design',
    href: '/#contact',
    icon: Ruler,
  },
  {
    title: 'Professional WordPress Websites',
    description:
      'We design and develop fast, responsive, SEO friendly WordPress websites with easy content management.',
    cta: 'Explore WordPress Development',
    href: '/#contact',
    icon: Globe,
  },
  {
    title: 'IoT & Embedded Systems',
    description:
      'Firmware, sensors, and real time monitoring dashboards for smart devices and automation.',
    cta: 'Explore IoT & Embedded Systems',
    href: '/#contact',
    icon: Router,
  },
];

export const testimonials = [
  {
    quote:
      "The team at ShafaCode didn't just write code; they understood our business goals. Their product-minded approach saved us months of development time.",
    name: 'Mark Sullivan',
    role: 'CTO at TechStream',
  },
  {
    quote:
      "ShafaCode's expertise in both software and IoT hardware was the key to our project's success.",
    name: 'Sarah Chen',
    role: 'Founder at GreenLog',
  },
  {
    quote:
      'A truly elite engineering partner. They build scalable solutions that actually grow with the business.',
    name: 'James Miller',
    role: 'Head of Product at Varko',
  },
];

export const videoStories = [
  {
    name: 'Anna Kar',
    quote:
      'The transformation of our platform was radical. ShafaCode delivered a competitive advantage.',
    role: 'Founder, Kickscore',
  },
  {
    name: 'Fahad Ahmed',
    quote:
      'Their engineering rigor is unmatched. We saw a 40% increase in system efficiency.',
    role: 'Founder, Italir Pothe',
  },
  {
    name: 'Jahid Vai',
    quote:
      'Their engineering rigor is unmatched. We saw a 40% increase in system efficiency.',
    role: 'Founder, Brandguru',
  },
];

export const faqs = [
  {
    q: 'How much does a software project cost?',
    a: 'It depends on features, timeline, and integrations. We provide a clear estimate after understanding your requirements.',
  },
  {
    q: 'Do you design and develop both?',
    a: 'Yes. Our team covers UI/UX design, front-end, back-end, and deployment, so you work with one partner from idea to launch.',
  },
  {
    q: 'Will I own the source code?',
    a: 'Yes. Once the project is delivered and paid for, the source code and all related assets belong to you.',
  },
  {
    q: 'Do you provide support after launch?',
    a: 'Yes. We offer maintenance and support plans for bug fixes, updates, and new features after launch.',
  },
  {
    q: 'Is Customer Support Available?',
    a: 'Our team is reachable by email, WhatsApp, and scheduled calls, and you get regular milestone updates throughout the project.',
  },
  {
    q: 'Do You Offer A Free Trial?',
    a: 'We offer a free consultation to scope your project. Reach out and we will suggest the best way to get started.',
  },
];

export const kickoffSteps = [
  {
    title: 'Share Your Requirements',
    text: 'Tell us about your project, business goal, or idea through a quick form or message.',
  },
  {
    title: 'Get a Clear Plan',
    text: 'We review your needs and prepare the right scope, timeline, and estimated budget.',
  },
  {
    title: "Let's Build It",
    text: 'Once everything is aligned, we kick off the project with clear communication and milestones.',
  },
];
