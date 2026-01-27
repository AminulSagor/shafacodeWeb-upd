"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toast } from "react-hot-toast";
import { useState } from "react";

interface DeclineToastContentProps {
  t: Toast;
  onConfirm: (reason: string) => Promise<void>;
}

export default function DeclineToastContent({
  t,
  onConfirm,
}: DeclineToastContentProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-3 bg-white p-4 shadow rounded-2xl">
      <p className="font-medium">Are you sure you want to decline this SOP?</p>

      <Input
        autoFocus
        placeholder="Enter decline reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.dismiss(t.id)}>
          Cancel
        </Button>

        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={!reason.trim()}
          onClick={async () => {
            toast.dismiss(t.id);
            await onConfirm(reason.trim());
          }}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
