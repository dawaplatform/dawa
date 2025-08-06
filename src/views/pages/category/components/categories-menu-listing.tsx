'use client';

import { useHasPremiumItems } from '@/components/features/carousels/product-carousel';
import MobileCategoryGrid from './MobileCategoryGrid';

export function CategoriesMenuListing() {
  const { hasProductData, isLoading } = useHasPremiumItems();

  // Don't render anything if there's no product data and we're not loading
  if ((!hasProductData && !isLoading)) {
    return null;
  }

  return (
    <div className="w-full">
      <MobileCategoryGrid />
    </div>
  );
}
