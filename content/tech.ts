import type { LucideIcon } from 'lucide-react';
import { Activity, Box, CircuitBoard, Cog, Cpu, PenTool, Radio, Wind } from 'lucide-react';

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
