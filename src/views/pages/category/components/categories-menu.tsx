'use client';

import {
  ProductCarousel,
  useHasPremiumItems,
} from '@/components/features/carousels/product-carousel';
import { PostAdvertCTA } from '@/components/shared/post-advert-cta';
import { SafetyTips } from '@/components/shared/safety-tips';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import MobileCategoryGrid from './MobileCategoryGrid';
import { MobilePostCTA } from './MobilePostCTA';
import { MobilePremiumCarousel } from './MobilePremiumCarousel';

export function CategoriesMenu() {
  const [isHovering, setIsHovering] = useState(false);
  const { hasProductData, isLoading } = useHasPremiumItems();

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Don't render anything if there's no product data and we're not loading
  if (!hasProductData && !isLoading) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-4">
        {/* Mobile Categories Grid */}
        <MobileCategoryGrid />
        
        {/* Mobile Premium Section */}
        <MobilePremiumCarousel />

        {/* Mobile CTA and Tips */}
        <div className="flex flex-col gap-4">
          <MobilePostCTA />
          <SafetyTips />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row gap-6">
        {/* Desktop Categories and Carousel Section */}
        <div
          className="flex-1 rounded-lg border bg-background shadow-sm overflow-hidden"
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative h-[400px]">
            <h1 className="text-xl font-semibold p-4">Premium Section</h1>
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-300 ease-in-out px-4',
                isHovering ? 'opacity-0 pointer-events-none' : 'opacity-100',
              )}
            >
              <ProductCarousel />
            </div>
          </div>
        </div>

        {/* Desktop Right Side Section */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-5">
          <PostAdvertCTA />
          <SafetyTips />
        </div>
      </div>
    </div>
  );
}
