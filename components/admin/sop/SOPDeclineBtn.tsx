"use client";

import { declineSOPById } from "@/actions/sops/declineSOPById";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeclineToastContent from "./DeclineToastContent";

interface SOPDeclineBtnProps {
  sopId: string;
}

export default function SOPDeclineBtn({ sopId }: SOPDeclineBtnProps) {
  const router = useRouter();

  const confirmDecline = () => {
    toast.custom(
      (t) => (
        <DeclineToastContent
          t={t}
          onConfirm={async (reason) => {
            try {
              const res = await declineSOPById(sopId, reason);

              if (!res.success) {
                toast.error(res.message);
                return;
              }

              toast.success("SOP declined successfully");

              // 🚀 instant UI update
              router.refresh();

              // 🔥 background notify (non-blocking)
              fetch("/api/sop/employee-notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userEmail: res.sopOwnerEmail,
                  title: "SOP Declined",
                  message: reason,
                  type: "SOP_DECLINED",
                  target: "employee",
                  sopId,
                }),
              });

              // close the custom toast
              toast.dismiss(t.id);
            } catch (e) {
              toast.error("Something went wrong");
            }
          }}
        />
      ),
      { duration: Infinity }
    );
  };

  return (
    <Button
      size="sm"
      className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800"
      onClick={confirmDecline}
    >
      Decline
      <XIcon className="h-4 w-4" />
    </Button>
  );
}
