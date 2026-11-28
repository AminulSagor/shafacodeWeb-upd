'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { firebaseClient } from '@/db/firebase-client';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export interface Project {
  id: string;
  title: string;
  summary?: string;
  description: string;
  client: string;
  contactEmail: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsListProps {
  projects: any;
}
const ProjectsList = ({ projects }: ProjectsListProps) => {
  const router = useRouter();
  const getHref = (contact: string) => {
    if (contact.includes('@')) return `mailto:${contact}`;
    if (!contact.startsWith('http')) return `https://${contact}`;
    return contact;
  };
  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(firebaseClient, 'projects', id));
      toast.error('Project deleted successfully.');
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-62.5">Project Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="">Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project: Project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    project.status === 'delivered'
                      ? 'default'
                      : project.status === 'in-progress'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {project.status}
                </Badge>
              </TableCell>

              <TableCell className="truncate max-w-50">
                <a
                  className="text-sky-600"
                  href={getHref(project.contactEmail)}
                >
                  {project.contactEmail}
                </a>
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant={'outline'}
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                >
                  <EyeIcon />
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    router.push(`/admin/projects/${project.id}/edit`);
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={() => {
                    handleDelete(project.id);
                  }}
                >
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsList;
