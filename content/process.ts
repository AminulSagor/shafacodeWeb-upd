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
