import ApplyForm from '@/components/careers/apply-form';
import ApplyHero from '@/components/careers/apply-hero';

const JobApplyPage = () => {
  return (
    <div className="bg-slate-950 border-b border-b-slate-700">
      <ApplyHero />
      <div className="max-w-4xl mx-auto space-y-8 my-10">
        <ApplyForm />
      </div>
    </div>
  );
};

export default JobApplyPage;
