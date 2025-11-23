import ApplyForm from '@/components/careers/apply-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const JobApplyPage = () => {
  return (
    <div className="bg-slate-950 py-16 border-b border-b-slate-700">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className=" bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-muted">
              Apply for this Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">
              Fill out the form below to submit your job application.
            </p>
          </CardContent>
        </Card>
        {/* Apply Form */}
        <ApplyForm />
      </div>
    </div>
  );
};

export default JobApplyPage;
