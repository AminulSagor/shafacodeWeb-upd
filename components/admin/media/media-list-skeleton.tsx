'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MediaListSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="rounded-xl overflow-hidden p-0">
          {/* Image Skeleton */}
          <CardContent className="p-0">
            <div className="relative max-w-lg aspect-video">
              <Skeleton className="absolute inset-0 w-full h-full" />
            </div>
          </CardContent>

          {/* URL text + button skeleton */}
          <div className="flex items-center justify-between p-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          {/* Date text skeleton */}
          <div className="px-3 pb-3">
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MediaListSkeleton;
