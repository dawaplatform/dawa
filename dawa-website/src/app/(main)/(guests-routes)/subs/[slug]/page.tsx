'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import type {
  Category,
  Subcategory,
} from '@/views/pages/category/types/category';
import { slugify } from '@/@core/utils/slugify';
import {
  categoryIconMap,
  subcategoryIconMap,
  UniversalFallbackIcon,
} from '@/views/pages/category/components/icon-maps';
import { selectCategories } from '@redux-store/slices/categories/categories';
import BackButton from '@/components/shared/BackButton';

/**
 * Transform a Redux category into a local Category type.
 * Ensures that each category has an href and that subcategories is always defined.
 */
function transformCategory(cat: any): Category {
  return {
    ...cat,
    // Generate the category href using slugify.
    href: `/cat/${slugify(cat.category_name)}`,
    subcategories: cat.subcategories
      ? cat.subcategories.map((sub: any) => ({
          id: sub.id,
          subcategory_name: sub.subcategory_name,
          name: sub.subcategory_name, // display name
          count: sub.subcategory_item_count || 0,
          // Generate the subcategory href: /cat/{category_slug}/{subcategory_slug}
          href: `/cat/${slugify(cat.category_name)}/${slugify(sub.subcategory_name)}`,
        }))
      : [],
  };
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const reduxCategories = useSelector(selectCategories);

  // Transform Redux categories into our local Category objects.
  const categories: Category[] = reduxCategories
    ? reduxCategories.map((cat: any) => transformCategory(cat))
    : [];

  // Extract the category slug from the URL.
  const { slug } = params;
  const categorySlug = Array.isArray(slug) ? slug[0] : slug;

  // If no category slug is provided, redirect to the main categories page.
  useEffect(() => {
    if (!categorySlug) {
      router.push('/home');
    }
  }, [categorySlug, router]);

  // Find the category by matching the slugified category name.
  const category = categories.find(
    (cat) => slugify(cat.category_name) === categorySlug,
  );

  if (!category) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-600">Category not found.</p>
      </div>
    );
  }

  // Get the category icon from your icon map or use the fallback.
  const CategoryIcon =
    categoryIconMap[category.category_name] || UniversalFallbackIcon;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Back Button and Category Name */}
      <header className="bg-white shadow-sm p-4 flex items-center">
        <BackButton />
        <div className="flex items-center">
          <CategoryIcon className="h-8 w-8 text-gray-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">
            {category.category_name}
          </h1>
        </div>
      </header>

      {/* Main Content: Display Subcategories */}
      <main className="flex-grow p-4">
        <p className="text-gray-600 mb-4">
          {(category.subcategories ?? []).length}{' '}
          {(category.subcategories ?? []).length === 1
            ? 'subcategory'
            : 'subcategories'}{' '}
          available
        </p>

        {(category.subcategories ?? []).length > 0 ? (
          <div className="space-y-3">
            {(category.subcategories ?? []).map((subcat: Subcategory) => {
              // Get the unique icon for the subcategory from the map or fallback.
              const SubIcon =
                subcategoryIconMap[subcat.subcategory_name] ||
                UniversalFallbackIcon;
              return (
                <Link
                  key={subcat.id}
                  href={subcat.href || '#'}
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="bg-gray-100 rounded-full p-3 mr-4">
                    <SubIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {subcat.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {subcat.count.toLocaleString()} items
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No subcategories available.
          </p>
        )}
      </main>
    </div>
  );
}
