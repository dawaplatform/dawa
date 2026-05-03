'use client';
import { useAuth } from '@/@core/hooks/use-auth';
import { useTrendingProducts } from '@/@core/hooks/useProductData';
import {
  buildCategoryImageMap,
  getCategoryImageUrl,
} from '@/@core/utils/categoryImage';
import { normalizeProducts } from '@/@core/utils/normalizeProductData';
import { slugify } from '@/@core/utils/slugify';
import { useDispatch, useSelector } from '@/redux-store/hooks';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';
import { CategoriesState } from '@/redux-store/slices/categories/categories';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { Category } from '../types/category';
import { categoryIconMap, UniversalFallbackIcon } from './icon-maps';

const MobileCategoryGrid: React.FC = React.memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const categories = useSelector((state: { categories: CategoriesState }) => state.categories.categories) as Category[];
  const status = useSelector((state: { categories: CategoriesState }) => state.categories.status);

  // Pull the currently loaded trending products so we can fall back to an
  // item's image when a category has no explicit image_url (mobile parity).
  const { productsData } = useTrendingProducts();
  const normalizedProducts = useMemo(
    () => normalizeProducts(productsData),
    [productsData],
  );
  const categoryImageMap = useMemo(
    () => buildCategoryImageMap(categories, normalizedProducts),
    [categories, normalizedProducts],
  );

  const handleSellClick = () => {
    if (!user) {
      dispatch(openAuthDialog());
    } else {
      router.push('/post-ad');
    }
  };

  if (status === 'loading') {
    return (
      <div className="grid grid-cols-4 gap-2">
        <div className="animate-pulse flex flex-col items-center justify-center p-4 bg-gray-300 text-white aspect-square rounded-lg">
          <div className="h-6 w-6 mb-2 bg-gray-400 rounded" />
          <span className="text-xs text-center bg-gray-400 h-3 w-full rounded" />
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex flex-col items-center justify-center p-4 bg-gray-300 border aspect-square rounded-lg"
          >
            <div className="h-6 w-6 mb-2 bg-gray-400 rounded" />
            <span className="text-xs text-center bg-gray-400 h-3 w-full rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Post Ad Button */}
      <button
        onClick={handleSellClick}
        className="flex flex-col items-center justify-center p-4 bg-gray-700 text-white aspect-square rounded-lg"
      >
        <Plus className="h-6 w-6 mb-2" />
        <span className="text-xs text-center">Post ad</span>
      </button>

      {/* Category List */}
      {categories.map((category) => {
        const { category_name } = category;
        const Icon = categoryIconMap[category_name] || UniversalFallbackIcon;
        const categorySlug = slugify(category_name);
        const imageUrl = getCategoryImageUrl(category, categoryImageMap);
        return (
          <Link key={category_name} href={`/subs/${categorySlug}`}>
            <div className="flex flex-col items-center justify-center bg-gray-100 border aspect-square rounded-lg overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={category_name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Icon className="w-16 h-16 text-primary" />
              )}
            </div>
            <span className="text-xs text-center line-clamp-2 mt-2 w-full">
              {category_name}
            </span>
          </Link>
        );
      })}
    </div>
  );
});

MobileCategoryGrid.displayName = 'MobileCategoryGrid';
export default MobileCategoryGrid;
