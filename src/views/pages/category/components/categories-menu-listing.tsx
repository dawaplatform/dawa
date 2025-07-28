'use client';

import { slugify } from '@/@core/utils/slugify';
import { useHasPremiumItems } from '@/components/features/carousels/product-carousel';
import Link from 'next/link';
import React, { useState } from 'react';
import MobileCategoryGrid from './MobileCategoryGrid';
import { categoryIconMap, UniversalFallbackIcon } from './icon-maps';

export function CategoriesMenuListing() {
  const [isHovering, setIsHovering] = useState(false);
  const { hasProductData, isLoading } = useHasPremiumItems();

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Fetch categories from the JSON file in the public folder (or from props/store if available)
  // For this example, let's fetch them like MobileCategoryGrid does
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
  React.useEffect(() => {
    fetch('/categories.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setIsCategoriesLoading(false);
      })
      .catch(() => {
        setIsCategoriesLoading(false);
      });
  }, []);

  // Don't render anything if there's no product data and we're not loading
  if ((!hasProductData && !isLoading) || isCategoriesLoading) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Categories Grid */}
        <div className="lg:hidden">
          <MobileCategoryGrid />
        </div>
        {/* Desktop Categories Grid */}
        <div className="hidden lg:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(({ category_name, image_url }: any) => {
            const Icon = categoryIconMap[category_name] || UniversalFallbackIcon;
            const categorySlug = slugify(category_name);
            return (
              <Link key={category_name} href={`/subs/${categorySlug}`}>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 border aspect-square rounded-lg">
                  {image_url ? (
                    <img src={image_url} alt={category_name} className="h-6 w-6 mb-2 object-contain" />
                  ) : (
                    <Icon className="h-6 w-6 mb-2 text-primary" />
                  )}
                </div>
                <span className="text-xs text-center line-clamp-2 mt-2 w-full">
                  {category_name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
