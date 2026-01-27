import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon, MoreHorizontal, FileText, Clock } from "lucide-react";

import Link from "next/link";
import { cookies } from "next/headers";
import SOPDeleteBtn from "./sopDeletebtn";
import SOPApproveBtn from "./SOPApproveBtn";
import SOPDeclineBtn from "./SOPDeclineBtn";
import { SOP } from "@/actions/sops/getSOPs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SOPListProps {
  sops: SOP[];
}

const SOPList = async ({ sops }: SOPListProps) => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-semibold leading-tight">
              Standard Operating Procedures
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Manage SOPs & approvals
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Total:{" "}
          <span className="font-medium text-foreground">{sops.length}</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[60px] font-semibold">#</TableHead>
            <TableHead className="font-semibold">SOP</TableHead>
            <TableHead className="text-right w-[200px] font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sops.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3} // ✅ FIX: table has 3 columns
                className="text-center py-10 text-muted-foreground"
              >
                No SOP found.
              </TableCell>
            </TableRow>
          ) : (
            sops.map((sop, index) => (
              <TableRow
                key={sop.id}
                className="group hover:bg-muted/20 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell>
                  <div className="min-w-0">
                    {(() => {
                      const text = sop.procedureSteps || "Untitled SOP";
                      const limit = 75;

                      return (
                        <div className="font-medium leading-snug break-words">
                          {text.length > limit
                            ? `${text.slice(0, limit)}.....`
                            : text}
                        </div>
                      );
                    })()}

                    {role === "admin" && (
                      <div className="mt-1 max-w-[900px] text-xs text-muted-foreground whitespace-pre-wrap break-words line-clamp-2">
                        {`createdBy: ${sop.createdBy ?? ""}`}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {sop.status === "pending" && role === "admin" && (
                      <div className="hidden md:flex items-center gap-2">
                        <SOPApproveBtn sopId={sop.id} />
                        <SOPDeclineBtn sopId={sop.id} />
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild className="gap-2">
                          <Link href={`/admin/sop/${sop.category}/${sop.id}/edit`}>
                            <EditIcon className="h-4 w-4" />
                            <span className="flex-1">Edit</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="gap-2">
                          <Link href={`/admin/sop/${sop.category}/${sop.id}`}>
                            <FileText className="h-4 w-4" />
                            <span className="flex-1">View Details</span>
                          </Link>
                        </DropdownMenuItem>

                        {role === "admin" ? (
                          // ✅ IMPORTANT: SOPDeleteBtn should internally render DropdownMenuItem
                          <SOPDeleteBtn sopId={sop.id} />
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div
                      className={cn(
                        "hidden md:block",
                        "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
                        "transition-opacity"
                      )}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SOPList;
