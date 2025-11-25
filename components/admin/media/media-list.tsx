'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

type MediaItem = {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

type MediaListProps = {
  media: MediaItem[];
  loading?: boolean;
};

const MediaList = ({ media = [], loading = false }: MediaListProps) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied URL!');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Loading skeletons
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="rounded-xl">
            <CardContent className="p-0">
              <Skeleton className="h-40 w-full" />
            </CardContent>
            <div className="p-3 border-t">
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // No media uploaded yet
  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg">No media uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {media.map((item) => (
        <Card key={item.id} className="rounded-xl overflow-hidden shadow p-0">
          <div className="relative max-w-lg aspect-video">
            <Image src={item.url} alt="media" fill className="object-cover" />
          </div>

          <div className="flex items-center justify-between p-3 ">
            <p className="text-xs text-slate-600 truncate max-w-[200px]">
              {item.url}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(item.url)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-3 pb-3 text-[10px] text-slate-500">
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MediaList;
