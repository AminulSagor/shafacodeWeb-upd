"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import createProject from "@/actions/projects/create-project";

const milestoneSchema = z.object({
  title: z.string().min(2, "Milestone title required"),
  dueAt: z.string().min(1, "Milestone date required"),
});

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  clientEmail: z.string().email("Valid client email is required"),
  contactEmail: z.string().email("Valid contact email is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["in-progress", "delivered"]),
  deadlineAt: z.string().optional(),
  milestones: z.array(milestoneSchema).min(1, "Add at least one milestone"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProjectFormUI() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      clientEmail: "",
      contactEmail: "",
      description: "",
      status: "in-progress",
      deadlineAt: "",
      milestones: [{ title: "", dueAt: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

const onSubmit = async (values: ProjectFormValues) => {
  if (submitting) return;

  setSubmitting(true);
  const loadingId = toast.loading("Creating project...");

  try {
    const res = await createProject(values);

    if (!res?.success) {
      toast.dismiss(loadingId);
      toast.error(res?.errorMsg || "Failed to create project");
      setSubmitting(false);
      return;
    }

    toast.dismiss(loadingId);
    toast.success("Project created!");
    form.reset();
    setSubmitting(false);

    router.push("/admin/projects");
  } catch (err) {
    console.error(err);
    toast.dismiss(loadingId);
    toast.error("Something went wrong");
    setSubmitting(false);
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Project</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="clientEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Email</FormLabel>
                    <FormControl>
                      <Input placeholder="client@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="contactEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="deadlineAt"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write project details..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-xl border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Milestones</h3>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ title: "", dueAt: "" })}
                >
                  + Add Milestone
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((row, index) => (
                  <div
                    key={row.id}
                    className="grid gap-2 rounded-xl border bg-muted/30 p-3 md:grid-cols-[1fr_200px_80px]"
                  >
                    <FormField
                      name={`milestones.${index}.title`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Milestone Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Milestone ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name={`milestones.${index}.dueAt`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Milestone Date
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1 || submitting}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
