'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarSkeleton() {
  return (
    <div className="w-full bg-white border rounded-lg">
      <div className="flex flex-col">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/50 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              {/* Icon Skeleton */}
              <Skeleton className="h-5 w-5 rounded-md bg-gray-200/70" />
              {/* Text Skeleton */}
              <Skeleton className="h-4 w-24 rounded-md bg-gray-200/70" />
            </div>
            {/* Chevron Skeleton */}
            <Skeleton className="h-4 w-4 rounded-sm bg-gray-200/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
