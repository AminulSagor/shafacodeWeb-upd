import type { ClientProfile, DashboardStats, Project } from "@/types/dashboard";

export const demoClient: ClientProfile = {
  name: "John Doe",
  company: "Company XYZ",
  clientId: "12345678",
  verified: true,
  avatarUrl: "/client.jpg",
};

export const demoStats: DashboardStats = {
  activeProjects: 3,
  pendingReview: 1,
  completedProjects: 8,
  nextMilestone: "Feb 1, 2026",
};

export const demoProjects: Project[] = [
  { id: "p1", name: "Website Redesign", status: "in_progress", progress: 45, deadline: "May 15, 2024", lastUpdated: "2 days ago" },
  { id: "p2", name: "Mobile App Development", status: "pending_review", progress: 100, deadline: "April 28, 2024", lastUpdated: "1 day ago" },
  { id: "p3", name: "Marketing Campaign", status: "on_hold", progress: 0, deadline: "June 10, 2024", lastUpdated: "5 days ago" },
  { id: "p4", name: "Product Launch", status: "in_progress", progress: 60, deadline: "July 1, 2024", lastUpdated: "1 week ago" },
];
