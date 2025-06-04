'use client';

import {
  useHasPremiumItems
} from '@/components/features/carousels/product-carousel';
import { useState } from 'react';
import MobileCategoryGrid from './MobileCategoryGrid';

export function CategoriesMenuListing() {
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

      </div>
    </div>
  );
}
