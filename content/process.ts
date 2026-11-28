import type { LucideIcon } from 'lucide-react';
import { Code, GitBranch, PenTool, Rocket, Search, ShieldCheck } from 'lucide-react';

export type ProcessStep = { title: string; body: string; time: string; icon: LucideIcon };

/** Six transparent stages (Home "A kinetic process", Services #process). */
export const processSteps: ProcessStep[] = [
  { title: 'Discovery', body: 'Scope, goals, fixed estimate', time: 'Week 1', icon: Search },
  { title: 'Planning', body: 'Flows, data model, architecture', time: 'Week 1-2', icon: GitBranch },
  { title: 'UI design', body: 'Clickable prototype you can test', time: 'Week 2-4', icon: PenTool },
  { title: 'Development', body: 'Two-week sprints with demos', time: 'Week 4+', icon: Code },
  { title: 'Testing', body: 'QA, performance, security', time: 'Every sprint', icon: ShieldCheck },
  { title: 'Launch', body: 'Deploy, monitor, support', time: '+30 days', icon: Rocket },
];

export type LifecycleStep = Omit<ProcessStep, 'icon'>;

/** Services "How we turn services into real products" (Figma 28:3770). */
export const lifecycleSteps: LifecycleStep[] = [
  { title: 'Discovery & requirements', body: 'Deep dive into your business logic and project goals.', time: 'Week 1' },
  { title: 'UX planning & system flow', body: 'User journeys and technical infrastructure, mapped and reviewed.', time: 'Week 1 to 2' },
  { title: 'UI design & prototype', body: 'High-fidelity, interactive designs you can click through.', time: 'Week 2 to 4' },
  { title: 'Development & integration', body: 'Clean, scalable code and connected APIs, demoed every milestone.', time: 'Week 4 onward' },
  { title: 'Testing & quality assurance', body: 'Rigorous testing for performance, security and accessibility.', time: 'Every sprint' },
  { title: 'Launch & support', body: 'Deployment and an ongoing maintenance strategy.', time: 'Launch + 30 days' },
];
