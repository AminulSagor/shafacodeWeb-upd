import { firebaseClient } from "@/db/firebase-client";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export type Milestone = {
  id: string;
  title: string;
  order: number;
  status: string;
  progress?: number;
  dueAt?: number;
  createdAt?: number;
  updatedAt?: number;
};

export type ProjectWithMilestones = {
  id: string;
  title: string;
  description?: string;
  status: string;
  clientEmail: string;
  contactEmail?: string;

  progress?: number;
  totalMilestones?: number;
  completedMilestones?: number;
  activeMilestoneId?: string;

  deadlineAt?: number;
  createdAt?: number;
  updatedAt?: number;

  milestones: Milestone[]; // ✅ added
};

const toMs = (v: any) =>
  typeof v?.toMillis === "function" ? v.toMillis() : v;

async function getProjectMilestones(projectId: string): Promise<Milestone[]> {
  const q = query(
    collection(firebaseClient, "projectsNew", projectId, "milestones"),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data: any = d.data();
    return {
      id: d.id,
      title: data.title,
      order: data.order ?? 0,
      status: data.status ?? "pending",
      progress: data.progress ?? 0,
      dueAt: toMs(data.dueAt),
      createdAt: toMs(data.createdAt),
      updatedAt: toMs(data.updatedAt),
    };
  });
}

export async function getClientProjects(
  email: string
): Promise<ProjectWithMilestones[]> {
  const q = query(
    collection(firebaseClient, "projectsNew"),
    where("clientEmail", "==", email),
   
  );

  const snap = await getDocs(q);

  // ✅ Fetch milestones for each project
  const projects = await Promise.all(
    snap.docs.map(async (docSnap) => {
      const data: any = docSnap.data();

      const milestones = await getProjectMilestones(docSnap.id);

      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        status: data.status,
        clientEmail: data.clientEmail,
        contactEmail: data.contactEmail,

        progress: data.progress ?? 0,
        totalMilestones: data.totalMilestones ?? milestones.length,
        completedMilestones: data.completedMilestones ?? 0,
        activeMilestoneId: data.activeMilestoneId ?? "",

        deadlineAt: toMs(data.deadlineAt),
        createdAt: toMs(data.createdAt),
        updatedAt: toMs(data.updatedAt),

        milestones, // ✅ all milestones
      } as ProjectWithMilestones;
    })
  );

  return projects;
}
