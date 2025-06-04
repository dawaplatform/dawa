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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Categories Grid */}
        <div className="lg:hidden">
          <MobileCategoryGrid />
        </div>

        {/* Desktop Categories and Carousel Section */}
        <div
          className="hidden lg:flex flex-col sm:flex-row h-[400px] flex-1 rounded-lg border bg-background shadow-sm overflow-hidden"
          onMouseLeave={handleMouseLeave}
        >
          {/* Subcategories and Product Carousel */}
          <div className="relative flex-1 overflow-hidden">
            {/* Product Carousel */}
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-300 ease-in-out',
                isHovering ? 'opacity-0 pointer-events-none' : 'opacity-100',
              )}
            >
              <ProductCarousel />
            </div>
          </div>
        </div>

        {/* Right Side Section */}
        <div className="hidden lg:flex flex-col sm:flex-row lg:flex-col w-full lg:w-64 gap-5">
          <PostAdvertCTA />
          <SafetyTips />
        </div>
      </div>
    </div>
  );
}
