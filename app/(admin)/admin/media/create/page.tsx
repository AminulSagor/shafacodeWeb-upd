import CreateMediaForm from '@/components/admin/media/create-media-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const MediaCreatePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Create Media</h2>
        <Button asChild>
          <Link href="/admin/media">Go Back</Link>
        </Button>
      </div>
      <CreateMediaForm />
    </div>
  );
};

export default MediaCreatePage;
