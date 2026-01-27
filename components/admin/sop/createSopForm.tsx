"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const createSopSchema = z.object({
  procedure: z
    .string()
    .min(1, "Procedure is required")
    .max(300, "Procedure cannot exceed 300 characters"),
});

type CreateSopFormValues = z.infer<typeof createSopSchema>;

interface CreateSopFormProps {
  role: string;
}

export const CreateSopForm = ({ role }: CreateSopFormProps) => {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();

  const form = useForm<CreateSopFormValues>({
    resolver: zodResolver(createSopSchema),
    defaultValues: { procedure: "" },
  });

  const onSubmit = async (values: CreateSopFormValues) => {
    const loadingId = toast.loading("Submitting SOP...");

    const status = role === "admin" ? "active" : "pending";

    const sopData = {
      procedureSteps: values.procedure,
      category,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await fetch("/api/sop/save-sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sopData),
      });

      const data = await res.json();
      toast.dismiss(loadingId);

      if (!data?.success) {
        toast.error("Error saving SOP: " + (data?.message ?? "Unknown error"));
        return;
      }

      toast.success(
        status === "active"
          ? "SOP created and activated."
          : "SOP submitted successfully! Wait for approval.",
      );

      // ✅ redirect instantly
      router.replace(`/admin/sop/${category}?status=active`);
      router.refresh();

      // ✅ background tasks via API (non-blocking)
      if (status === "pending") {
        fetch("/api/sop/admin-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: data.createdBy,
            title: "New SOP waiting for approval",
            message: sopData.procedureSteps,
            type: "SOP_PENDING",
            target: "admin",
            sopId: data.id,
            sopCategory: data.sopCategory,
          }),
        });
      }

      if (status === "active") {
        fetch("/api/sop/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sopId: data.id }),
        });
      }
    } catch {
      toast.dismiss(loadingId);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="procedure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Procedure</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-64"
                      placeholder="Enter SOP procedure"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4 w-full">
              Submit SOP
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
