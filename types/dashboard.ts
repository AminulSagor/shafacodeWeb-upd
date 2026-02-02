export type ProjectStatus = "in-progress" | "delivered";

export type Milestone = {
  id: string;
  title: string;
  order: number;
  status: "pending" | "in-progress" | "completed" | "blocked" | string;
  progress?: number;
  dueAt?: number; // ms
  createdAt?: number; // ms
  updatedAt?: number; // ms
};

export type Project = {
  id: string;

  // Firestore fields
  title: string;
  description?: string;
  status: ProjectStatus;

  clientEmail: string;
  contactEmail: string;

  deadlineAt?: number; // ms
  createdAt?: number; // ms
  updatedAt?: number; // ms

  // summary fields
  progress?: number; // 0-100 (optional)
  totalMilestones?: number;
  completedMilestones?: number;
  activeMilestoneId?: string;

  // ✅ include milestones when you fetch them
  milestones?: Milestone[];
};

export type ClientProfile = {
  name: string;
  company: string;
  clientId: string;
  verified: boolean;
  avatarUrl: string;
};

export type DashboardStats = {
  activeProjects: number;
  completedProjects: number;
  nextMilestone: string;
};
