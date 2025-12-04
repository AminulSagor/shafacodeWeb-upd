'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import createApply from '@/actions/apply/create-apply';
import { Loader2 } from 'lucide-react';

const applySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  subject: z.string().min(1, 'Subject is required'),
  resume: z
    .instanceof(File, { message: 'Resume (PDF) is required' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Resume must be a PDF file',
    }),
  coverLetter: z.string().optional(),
});

type ApplyFormValues = z.infer<typeof applySchema>;

const ApplyForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      phone: '',
      coverLetter: '',
    },
  });

  const onSubmit = async (values: ApplyFormValues) => {
    try {
      setLoading(true);
      let fileUrl = null;
      if (values.resume) {
        const file = values.resume;
        const fileName = `${Date.now()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shafacode')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Try again later.');
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('shafacode')
          .getPublicUrl(fileName);
        fileUrl = publicUrlData?.publicUrl;
      }

      const payload = {
        fullName: values.fullName,
        email: values.email,
        subject: values.subject,
        phone: values.phone,
        coverLetter: values.coverLetter,
        resumeUrl: fileUrl,
        isViewed: false,
      };

      const appliedJob = await createApply(payload);

      if (appliedJob.success) {
        toast.success('Application submitted successfully!');
        form.reset();
      } else {
        toast.error('Try again later.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-slate-100">
          Application Form
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Full Name <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      className="bg-slate-800 border-sky-700 focus-visible:border-sky-700 focus-visible:ring-sky-600 focus-visible:ring-2
                      text-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Email Address <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@mail.com"
                      className="bg-slate-800 border-sky-700 focus-visible:border-sky-700 focus-visible:ring-sky-600 focus-visible:ring-2
                      text-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Phone Number <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+8801XXXXXXXXX"
                      className="bg-slate-800 border-sky-700 focus-visible:border-sky-700 focus-visible:ring-sky-600 focus-visible:ring-2
                      text-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Subject <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Application for Software Engineer"
                      className="bg-slate-800 border-sky-700 focus-visible:border-sky-700 focus-visible:ring-sky-600 focus-visible:ring-2
                      text-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Letter */}
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a short introduction..."
                      className="h-40 bg-slate-800 border-sky-700 focus-visible:border-sky-700 focus-visible:ring-sky-600 focus-visible:ring-2
                      text-slate-200"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume */}
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Resume (PDF) <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      className=" bg-slate-800 border-sky-700 focus-visible:border-sky-700 focus-visible:ring-sky-600 focus-visible:ring-2
                      text-slate-200 file:text-muted"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full  bg-sky-400 text-primary hover:bg-sky-600"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ApplyForm;
