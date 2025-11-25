import MediaListLoader from '@/components/admin/media/media-list-loader';
import MediaListSkeleton from '@/components/admin/media/media-list-skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

const MediaPage = async () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Media</h2>
        <Button className="hover:cursor-pointer" asChild>
          <Link href={'/admin/media/create'}>Create Media</Link>
        </Button>
      </div>
      <Suspense fallback={<MediaListSkeleton />}>
        <MediaListLoader />
      </Suspense>
    </div>
  );
};

export default MediaPage;
