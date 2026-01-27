"use client";

import { approveSOPById } from "@/actions/sops/approveSOPById";
import { createNotification } from "@/actions/sops/createNotification";
import { notifyUsersBySOP } from "@/actions/sops/notifyUsersBySOP";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SOPApproveBtnProps {
  sopId: string;
}

export default function SOPApproveBtn({ sopId }: SOPApproveBtnProps) {
  const router = useRouter();

const handleApprove = async () => {
  try {
    const res = await approveSOPById(sopId);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("SOP approved successfully");

    // 🚀 instant UI update
    router.refresh();

    // 🔥 background jobs (NON-BLOCKING via API)
    fetch("/api/sop/employee-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: res.sopOwnerEmail,
        title: "SOP Approved",
        message: "Your SOP was approved",
        type: "SOP_APPROVED",
        target: "employee",
        sopId,
      }),
    });

    fetch("/api/sop/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sopId }),
    });
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

  const confirmApprove = () => {
    toast(
      (t) => (
        <div className="space-y-3">
          <p className="font-medium">
            Are you sure you want to approve this SOP?
          </p>

          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                await handleApprove();
              }}
            >
              OK
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  return (
    <Button
      size="sm"
      className="bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800"
      onClick={confirmApprove}
    >
      Approve
      <CheckIcon className="h-4 w-4" />
    </Button>
  );
}
