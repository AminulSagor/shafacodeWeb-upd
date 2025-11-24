'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { firebaseClient } from '@/db/firebase-client';
import { doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const JobApplicationsList = ({ applications }: any) => {
  const router = useRouter();

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(firebaseClient, 'apply-jobs', id));
      toast.success('Application deleted successfully.');
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete application.');
    }
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.map((app: any) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">{app.name}</TableCell>
              <TableCell className="font-medium">{app.subject}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/admin/job-applications/${app.id}`)
                  }
                >
                  <EyeIcon />
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(app.id)}
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

export default JobApplicationsList;
