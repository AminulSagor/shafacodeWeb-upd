export type ProjectType = {
  title?: string;
  description?: string;
  client?: string;
  status?: string;
  contact?: string;
};

export type JobType = {
  title: string;
  slug: string;
  department: string;
  type: 'Full-time' | 'Part-time' | string;
  location: string;
  jobDescription: string;
};



export type SOPType = {
   id: string;
  title?: string;
  category?: string;
  status?: "pending" | "active";
  procedureSteps?: string;
  createdAt?: string;
  updatedAt?: string;
};