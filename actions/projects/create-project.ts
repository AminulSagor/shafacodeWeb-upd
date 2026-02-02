'use server';

import { ProjectFormValues } from '@/components/admin/projects/create-project-form';
import { db } from '@/db/firebase-admin';

const createProject = async (project: ProjectFormValues) => {
  try {
    const now = Date.now();

    // ---------------- Project Payload ----------------
    const projectPayload = {
      title: project.title,
      description: project.description,
      status: project.status,

      clientEmail: project.clientEmail,     // ✅
      contactEmail: project.contactEmail,   // ✅

      deadlineAt: project.deadlineAt
        ? new Date(project.deadlineAt).getTime()
        : null,                             // ✅

      // milestone summary
      progress: 0,
      totalMilestones: project.milestones.length,
      completedMilestones: 0,
      activeMilestoneId: "",

      createdAt: now,
      updatedAt: now,
    };

    // ---------------- Create Project ----------------
    const projectRef = await db.collection('projectsNew').add(projectPayload);

    // ---------------- Create Milestones Subcollection ----------------
    let firstMilestoneId = '';

    for (let i = 0; i < project.milestones.length; i++) {
      const m = project.milestones[i];

      const milestonePayload = {
        title: m.title,
        order: i + 1,
        status: 'pending',
        progress: 0,

        dueAt: new Date(m.dueAt).getTime(),   // ✅ milestone date

        createdAt: now,
        updatedAt: now,
        updatedBy: 'admin',
      };

      const mRef = await db.collection('projectsNew')
        .doc(projectRef.id)
        .collection('milestones')
        .add(milestonePayload);

      if (i === 0) firstMilestoneId = mRef.id;
    }

    // ---------------- Set Active Milestone ----------------
    if (firstMilestoneId) {
      await db.collection('projectsNew').doc(projectRef.id).update({
        activeMilestoneId: firstMilestoneId,
      });
    }

    return { success: true, id: projectRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, errorMsg: 'Failed to create project' };
  }
};

export default createProject;
