import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

/**
 * ShopSkeleton
 * Provides a skeleton UI for:
 * 1. Store header (profile image, store info, action buttons)
 * 2. A banner area
 * 3. A filter-by-category row
 * 4. Main content with a sidebar and product listing
 */
export const ShopSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* =============== 1) Store Header =============== */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4">
          {/* Left: Profile Image + Basic Info */}
          <div className="flex items-center space-x-4">
            {/* Profile Image Skeleton */}
            <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
            {/* Info Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 md:w-48" />
              <Skeleton className="h-4 w-20 md:w-32" />
            </div>
          </div>
          {/* Right: Action Buttons */}
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-20 md:w-24" />
            <Skeleton className="h-10 w-20 md:w-24" />
          </div>
        </div>
      </div>

      {/* =============== 2) Banner Skeleton =============== */}
      <Skeleton className="w-full h-16 md:h-20 lg:h-24 rounded-lg" />

      {/* =============== 3) Filter-by-Category Row =============== */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Example category pills */}
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>

      {/* =============== 4) Main Content =============== */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-1/4 space-y-4">
          {/* Price Range */}
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          {/* Possibly more filter placeholders */}
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-32" />
        </aside>

        {/* Products Grid Skeleton */}
        <main className="w-full lg:w-3/4 space-y-4">
          {/* Sort / Additional Filters Row */}
          <Skeleton className="h-10 w-1/2" />

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full h-48 sm:h-64 rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopSkeleton;
