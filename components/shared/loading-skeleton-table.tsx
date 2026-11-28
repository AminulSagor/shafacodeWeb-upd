import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function JobApplicationsSkeleton() {
  const rows = Array.from({ length: 5 });

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-50">Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((_, i) => (
            <TableRow key={i}>
              <TableCell className="w-75">
                <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
              </TableCell>

              <TableCell>
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full" />
              </TableCell>

              <TableCell className="text-right space-x-2">
                <div className="inline-block h-8 w-8 bg-gray-200 animate-pulse rounded" />
                <div className="inline-block h-8 w-8 bg-gray-200 animate-pulse rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
