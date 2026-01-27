"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SOP } from "@/actions/sops/getSOPs";
import toast from "react-hot-toast";
import { updateSOPById } from "@/actions/sops/updateSOPById";
import { useRouter } from "next/navigation";

interface EditSOPFormProps {
  sop: SOP;
  email: string;
  role: string;
}

const EditSOPForm = ({ sop, email, role }: EditSOPFormProps) => {
  const [procedureSteps, setProcedureSteps] = useState(sop.procedureSteps);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    const loadingId = toast.loading("Updating SOP...");

    const updaterEmail = email || "unknown";
    const nextStatus = role === "admin" ? "active" : "pending";

    try {
      const result = await updateSOPById(
        sop.id,
        { procedureSteps, status: nextStatus },
        {
          by: updaterEmail,
          prev: {
            procedureSteps: sop.procedureSteps,
            status: sop.status,
            title: sop.title,
          },
        }
      );

      toast.dismiss(loadingId);

      if (!result.success) {
        toast.error("Failed to update SOP.");
        setLoading(false);
        return;
      }

      toast.success(
        nextStatus === "active"
          ? "SOP updated and activated."
          : "SOP updated. Waiting for admin approval."
      );

      // 🚀 redirect instantly
      router.replace(`/admin/sop/${sop.category}`);
      router.refresh();

      // 🔥 background jobs (API = non-blocking)
      if (nextStatus === "pending") {
        fetch("/api/sop/admin-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: updaterEmail,
            title: "SOP Updated (Pending Approval)",
            message: procedureSteps,
            type: "SOP_PENDING",
            target: "admin",
            sopId: sop.id,
            sopCategory: sop.category,
          }),
        });
      }

      if (nextStatus === "active") {
        fetch("/api/sop/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sopId: sop.id }),
        });
      }
    } catch (e) {
      toast.dismiss(loadingId);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Procedure</label>
            <Textarea
              rows={6}
              value={procedureSteps}
              className="h-64"
              onChange={(e) => setProcedureSteps(e.target.value)}
            />
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditSOPForm;
