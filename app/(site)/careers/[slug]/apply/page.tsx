import ApplyForm from '@/components/careers/apply-form';
import ApplyHero from '@/components/careers/apply-hero';

const JobApplyPage = () => {
  return (
    <main>
      <ApplyHero />
      <div className="mx-auto max-w-3xl px-4 pb-24">
        <ApplyForm />
      </div>
    </main>
  );
};

export default JobApplyPage;
