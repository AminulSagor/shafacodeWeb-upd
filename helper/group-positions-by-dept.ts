import { JobType } from '@/types';

export const groupPositionsByDepartment = (openPositions: JobType[]) => {
  const grouped = Object.values(
    openPositions.reduce((acc, job) => {
      if (!acc[job.department]) {
        acc[job.department] = {
          department: job.department,
          jobs: [],
        };
      }
      acc[job.department].jobs.push({
        title: job.title,
        slug: job.slug,
        type: job.type,
        location: job.location,
      });
      return acc;
    }, {} as Record<string, { department: string; jobs: any[] }>)
  );

  return grouped;
};
