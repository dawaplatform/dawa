import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const SkeletonProductCard: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <Card
          className="hover:shadow-md transition-shadow duration-200"
          key={index}
        >
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Image skeleton */}
              <Skeleton className="w-full sm:w-48 h-48 rounded-lg" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-4">
                {/* Title and action buttons */}
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex sm:flex-col gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>

                {/* Description */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                {/* Meta info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>

                {/* Action button */}
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SkeletonProductCard;
