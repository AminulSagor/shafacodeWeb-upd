// app/admin/sop/[id]/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { getSOPById } from "@/actions/sops/getSOPById";
import SOPApproveBtn from "@/components/admin/sop/SOPApproveBtn";
import SOPDeclineBtn from "@/components/admin/sop/SOPDeclineBtn";

type PageProps = {
  params: { id: string };
};

export default async function SOPDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  const sop = await getSOPById(id);

  if (!sop) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto rounded-lg border bg-white p-6">
          <h1 className="text-xl font-semibold">SOP not found</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This SOP may have been deleted or the link is wrong.
          </p>
          <div className="mt-4">
            <Link href="/admin/sop">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusLabel =
    sop.status === "active"
      ? "Active"
      : sop.status === "pending"
        ? "Pending"
        : sop.status === "declined"
          ? "Declined"
          : sop.status;

  const statusVariant =
    sop.status === "active"
      ? "bg-green-100 text-green-700"
      : sop.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-rose-100 text-rose-700";

  const history = Array.isArray(sop.history) ? sop.history : [];
  console.log("heeeee", history);
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">SOP Details</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="outline">{sop.category}</Badge>
                <Badge className={`${statusVariant}`}>{statusLabel}</Badge>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2">
              {/* Admin-only approve/decline */}
              {role === "admin" && sop.status === "pending" && (
                <>
                  <SOPApproveBtn sopId={sop.id} />
                  <SOPDeclineBtn sopId={sop.id} />
                </>
              )}

              <Link href={`/admin/sop/${sop.category}/${sop.id}/edit`}>
                <Button>Edit</Button>
              </Link>

              <Link href={`/admin/sop/${sop.category}?status=active`}>
                <Button variant="outline">Back</Button>
              </Link>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-md border bg-muted/20 p-4">
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{sop.category}</p>
            </div>

            <div className="rounded-md border bg-muted/20 p-4">
              <p className="text-muted-foreground">Created By</p>
              <p className="font-medium">{sop.createdBy ?? "—"}</p>
            </div>

            <div className="rounded-md border bg-muted/20 p-4">
              <p className="text-muted-foreground">Created At</p>
              <p className="font-medium">
                {sop.createdAt ? new Date(sop.createdAt).toLocaleString() : "—"}
              </p>
            </div>

            <div className="rounded-md border bg-muted/20 p-4">
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {sop.updatedAt ? new Date(sop.updatedAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Procedure */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-2">Procedure Steps</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Full SOP procedure and instructions.
          </p>

          <div className="rounded-md border bg-muted/20 p-4">
            <div className="text-sm max-w-none whitespace-pre-wrap">
              {sop.procedureSteps || "No procedure steps found."}
            </div>
          </div>
        </div>

        {/* Update History (admin only) */}
        {role === "admin" && (
          <div className="rounded-xl border bg-gradient-to-br from-white to-muted/30 p-6 ">
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Update History
              </h2>
              <p className="text-sm text-muted-foreground">
                Track who updated this SOP and what changes were made
              </p>
            </div>

            {history.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                No update history available yet
              </div>
            ) : (
              <div className="relative space-y-4">
                {/* vertical line */}
                <div className="absolute left-3 top-0 bottom-0 w-px bg-muted/60" />

                {history
                  .slice()
                  .reverse()
                  .map((h: any, idx: number) => (
                    <div key={idx} className="relative pl-10">
                      {/* dot */}
                      <div className="absolute left-[7px] top-3 h-2.5 w-2.5 rounded-full bg-primary " />

                      <div className="rounded-xl border bg-white p-4 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {h.action || "UPDATED"}{" "}
                              <span className="text-muted-foreground font-normal">
                                by
                              </span>{" "}
                              <span className="text-primary font-medium">
                                {h.by || "unknown"}
                              </span>
                            </p>

                            {h.note ? (
                              <p className="mt-1 text-sm text-muted-foreground italic">
                                “{h.note}”
                              </p>
                            ) : null}
                          </div>

                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {h.at ? new Date(h.at).toLocaleString() : "—"}
                          </span>
                        </div>

                        {/* Changes */}
                        {h.changes?.procedureSteps && (
                          <div className="mt-3 rounded-lg bg-muted/30 p-3 text-xs">
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Procedure Update
                            </div>

                            <div className="space-y-2">
                              {/* OLD */}
                              <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">
                                  Previous
                                </div>
                                <div className="px-3 py-2 rounded bg-red-50 text-red-700 text-sm line-through whitespace-pre-wrap break-words">
                                  {String(h.changes.procedureSteps.from ?? "")}
                                </div>
                              </div>

                              {/* NEW */}
                              <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">
                                  Updated
                                </div>
                                <div className="px-3 py-2 rounded bg-emerald-50 text-emerald-700 text-sm font-medium whitespace-pre-wrap break-words">
                                  {String(h.changes.procedureSteps.to ?? "")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
