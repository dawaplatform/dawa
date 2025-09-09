import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ImageSkeleton: React.FC = () => (
  <Card className="relative overflow-hidden bg-gray-100">
    <div className="relative aspect-[4/3] md:aspect-[16/9]">
      <Skeleton className="absolute inset-0" />
    </div>
    <div className="absolute bottom-4 left-4 flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="absolute bottom-4 right-4 h-6 w-16 rounded-full" />
  </Card>
);

const ThumbnailsSkeleton: React.FC = () => (
  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 px-1">
    {[...Array(8)].map((_, index) => (
      <Skeleton key={index} className="aspect-square rounded-lg" />
    ))}
  </div>
);

const ProductInfoSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-20 w-full" />
    </CardContent>
  </Card>
);

const SellerInfoSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ActionButtonsSkeleton: React.FC = () => (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <Skeleton key={index} className="h-12 w-full" />
    ))}
  </div>
);

const ShareSectionSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-6 w-1/2" />
      </CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </CardContent>
  </Card>
);

const PostAdSkeleton: React.FC = () => (
  <div className="bg-primary_1 p-6 rounded-lg shadow-lg">
    <Skeleton className="h-6 w-3/4 bg-white/50 mb-4" />
    <Skeleton className="h-4 w-full bg-white/50 mb-4" />
    <Skeleton className="h-12 w-full bg-white/50" />
  </div>
);

const ProductTabsSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex space-x-4 mb-6">
        {['Description', 'Specifications', 'Reviews'].map((_, index) => (
          <Skeleton key={index} className="h-8 w-28" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-10 bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-5">
          <Skeleton className="h-6 w-64" />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <ImageSkeleton />
            <ThumbnailsSkeleton />

            <ProductTabsSkeleton />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-5 space-y-6">
              <ShareSectionSkeleton />
              <ProductInfoSkeleton />
              <ActionButtonsSkeleton />
              <PostAdSkeleton />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for mobile */}
      <div className="fixed bottom-5 right-5 lg:hidden">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </div>
  );
}
