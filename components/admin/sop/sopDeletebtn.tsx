"use client";

import { deleteSOPById } from "@/actions/sops/deleteSOPById";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SOPDeleteBtnProps {
  sopId: string;
}

export default function SOPDeleteBtn({ sopId }: SOPDeleteBtnProps) {
  const router = useRouter();

  const confirmDelete = (id: string) => {
    toast(
      (t) => (
        <div className="space-y-3">
          <p className="font-medium">
            Are you sure you want to delete this SOP?
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
              className="bg-red-50 hover:bg-red-100 text-red-600"
              onClick={async () => {
                toast.dismiss(t.id);
                await handleDelete(id);
              }}
            >
              OK
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSOPById(id);

      if (res.success) {
        toast.success("SOP deleted successfully");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="gap-2"
        onSelect={(e) => {
          e.preventDefault(); // keeps dropdown stable
          confirmDelete(sopId);
        }}
      >
        <Trash2 className="h-4 w-4 text-rose-600" />
        <span className="flex-1 text-rose-600">Delete</span>
      </DropdownMenuItem>
    </>
  );
}
