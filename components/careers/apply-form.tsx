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

const applySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  resume: z
    .instanceof(File, { message: 'Resume (PDF) is required' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Resume must be a PDF file',
    }),
  coverLetter: z.string().optional(),
});

type ApplyFormValues = z.infer<typeof applySchema>;

const ApplyForm = () => {
  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
    },
  });

  const onSubmit = (values: ApplyFormValues) => {
    console.log('Application Data:', values);
    alert('Application submitted successfully!');
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
                      className="bg-slate-800 text-slate-100 border border-slate-600
                                 placeholder:text-slate-400 focus-visible:ring-slate-800"
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
                      className="bg-slate-800 text-slate-100 border border-slate-600
                                 placeholder:text-slate-400 focus-visible:ring-slate-800"
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
                      className="bg-slate-800 text-slate-100 border border-slate-600
                                 placeholder:text-slate-400 focus-visible:ring-slate-800"
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
                      className="h-40 bg-slate-800 text-slate-100 border border-slate-600
                                 placeholder:text-slate-400 focus-visible:ring-slate-800"
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
                      className="bg-slate-800 text-slate-100 border border-slate-600
                                 file:bg-slate-700 file:text-slate-300 file:border-0
                                 focus-visible:ring-slate-300"
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
              className="w-full  bg-sky-400 text-primary hover:bg-sky-600"
            >
              Submit Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ApplyForm;
