import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Box,
  CircuitBoard,
  Cloud,
  Code,
  Cog,
  Cpu,
  Globe,
  LayoutGrid,
  MousePointerClick,
  Palette,
  PenTool,
  Radio,
  Search,
  Wind,
} from 'lucide-react';

import type { BrandName } from '@/components/site/brand-logo';

export type Tech = {
  name: string;
  category: string;
} & ({ brand: BrandName; icon?: never } | { icon: LucideIcon; brand?: never });

/** Home "Technologies we work with": 18 cells, 6 by 3. */
export const techStack: Tech[] = [
  { name: 'React', category: 'Frontend', brand: 'react' },
  { name: 'Next.js', category: 'Frontend', brand: 'nextjs' },
  { name: 'TypeScript', category: 'Language', brand: 'typescript' },
  { name: 'Tailwind CSS', category: 'Styling', icon: Wind },
  { name: 'Flutter', category: 'Mobile', brand: 'flutter' },
  { name: 'WordPress', category: 'CMS', brand: 'wordpress' },
  { name: 'Node.js', category: 'Backend', brand: 'nodejs' },
  { name: 'Laravel', category: 'Backend', brand: 'laravel' },
  { name: 'REST API', category: 'Integration', icon: Cog },
  { name: 'Firebase', category: 'Data', brand: 'firebase' },
  { name: 'MongoDB', category: 'Data', brand: 'mongodb' },
  { name: 'PostgreSQL', category: 'Data', brand: 'postgresql' },
  { name: 'ESP32', category: 'IoT hardware', icon: Cpu },
  { name: 'Raspberry Pi', category: 'IoT hardware', icon: CircuitBoard },
  { name: 'MQTT', category: 'IoT messaging', icon: Radio },
  { name: 'Sensor integration', category: 'IoT', icon: Activity },
  { name: 'Figma', category: 'Design', icon: PenTool },
  { name: 'Docker', category: 'DevOps', icon: Box },
];

const brandByName: Record<string, BrandName> = {
  React: 'react',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  'Tailwind CSS': 'tailwind',
  Flutter: 'flutter',
  WordPress: 'wordpress',
  'Node.js': 'nodejs',
  Laravel: 'laravel',
  Firebase: 'firebase',
  MongoDB: 'mongodb',
  PostgreSQL: 'postgresql',
  'Raspberry Pi': 'raspberrypi',
  MQTT: 'mqtt',
  Docker: 'docker',
  Figma: 'figma',
  FigJam: 'figma',
  Stripe: 'stripe',
  WooCommerce: 'woocommerce',
  'Google Play': 'googleplay',
  'App Store': 'appstore',
  Elementor: 'elementor',
  PHP: 'php',
  Cloudflare: 'cloudflare',
  ESP32: 'espressif',
};

const iconByName: Record<string, LucideIcon> = {
  'REST API': Cog,
  HTTP: Globe,
  Cloud: Cloud,
  Prototyping: MousePointerClick,
  'Design systems': LayoutGrid,
  'UX research': Search,
  Branding: Palette,
  SEO: Search,
};

/** Logo or icon for a technology name; falls back to a generic code icon. */
export function techVisual(name: string): { brand: BrandName } | { icon: LucideIcon } {
  const brand = brandByName[name];
  if (brand) return { brand };
  return { icon: iconByName[name] ?? Code };
}
