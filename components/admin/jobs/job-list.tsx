"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { firebaseClient } from "@/db/firebase-client";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from 'sonner';
import capitalizeWords from "@/helper/capitalized-words";

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  type: string;
  location: string;
  jobDescription: string;
}

export interface JobListProps {
  jobs: Job[];
}
const JobList = ({ jobs }: JobListProps) => {
  const router = useRouter();
  const getHref = (contact: string) => {
    if (contact.includes("@")) return `mailto:${contact}`;
    if (!contact.startsWith("http")) return `https://${contact}`;
    return contact;
  };
  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(firebaseClient, "jobs", id));
      toast.error("Job deleted successfully.");
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
            <TableHead className="w-[250px]">Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="">Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job: Job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{capitalizeWords(job.department)}</TableCell>
              <TableCell>
                <Badge
                  variant={job.type === "Full-time" ? "default" : "secondary"}
                >
                  {capitalizeWords(job.type)}
                </Badge>
              </TableCell>

              <TableCell className="truncate max-w-[200px]">
                {job.location}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant={"outline"}
                  onClick={() => router.push(`/admin/jobs/${job.id}`)}
                >
                  <EyeIcon />
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    router.push(`/admin/jobs/${job.id}/edit`);
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    handleDelete(job.id);
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

export default JobList;
