'use client';

import { slugify } from '@/@core/utils/slugify';
import { getProductCategories } from '@/app/server/categories/api';
import CustomizableNoData from '@/components/shared/no-data';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type {
  Category,
  Subcategory,
} from '@/views/pages/category/types/category';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePopper } from 'react-popper';
import useSWR from 'swr';
import SidebarSkeleton from './SidebarSkeleton';
import {
  categoryIconMap,
  subcategoryIconMap,
  UniversalFallbackIcon,
} from './icon-maps';

// Define props with an optional onSelect callback.
interface SidebarProps {
  onSelect?: () => void;
}

/**
 * Transform raw category data into a local Category format.
 */
function transformCategory(rawCat: any): Category {
  return {
    id: rawCat.id,
    category_name: rawCat.category_name,
    category_item_count: rawCat.category_item_count,
    image_url: rawCat.image_url, // Add this line
    subcategories: rawCat.subcategories
      ? rawCat.subcategories.map(
        (sub: any): Subcategory => ({
          id: sub.id,
          subcategory_name: sub.subcategory_name,
          name: sub.subcategory_name,
          metadata: sub.metadata,
          count: sub.subcategory_item_count || 0,
          icon: sub.icon || '',
          image_url: sub.image_url, // And this line
          href: `/cat/${slugify(rawCat.category_name)}/${slugify(sub.subcategory_name)}`,
        }),
      )
      : [],
  };
}

// SWR fetchers.
const apiCategoriesFetcher = async () => {
  try {
    const data = await getProductCategories();
    return data && data.length > 0 ? data.map(transformCategory) : null;
  } catch (error) {
    console.error('Error fetching categories from API:', error);
    throw error;
  }
};

const fallbackCategoriesFetcher = async () => {
  try {
    const res = await fetch('/categories.json');
    const data = await res.json();
    return data && data.length > 0 ? data.map(transformCategory) : [];
  } catch (error) {
    console.error('Error fetching fallback categories:', error);
    throw error;
  }
};

const API_CATEGORIES_KEY = 'api-categories';
const FALLBACK_CATEGORIES_KEY = 'fallback-categories';

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  // Use SWR to fetch categories from API with caching.
  const {
    data: apiCategories,
    error: apiError,
    isLoading: isLoadingApi,
  } = useSWR(API_CATEGORIES_KEY, apiCategoriesFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
  });

  // Only fetch fallback categories if API categories failed or returned empty.
  const shouldFetchFallback =
    apiError || (apiCategories === null && !isLoadingApi);

  const { data: fallbackCategories, isLoading: isLoadingFallback } = useSWR(
    shouldFetchFallback ? FALLBACK_CATEGORIES_KEY : null,
    fallbackCategoriesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    },
  );

  // Combine the categories from API and fallback.
  const categories: Category[] = apiCategories || fallbackCategories || [];
  const isLoading = isLoadingApi || (shouldFetchFallback && isLoadingFallback);

  // Track the currently hovered category.
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  // Refs for Popper and container.
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Popper.
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'right-start',
      modifiers: [
        { name: 'preventOverflow', options: { boundary: 'clippingParents' } },
        { name: 'offset', options: { offset: [12, 0] } },
      ],
    },
  );

  // Call onSelect when an item is clicked.
  const handleItemClick = useCallback(() => {
    if (onSelect) onSelect();
  }, [onSelect]);

  const handleMouseEnterCategory = useCallback(
    (cat: Category, e: ReactMouseEvent<HTMLElement>) => {
      setHoveredCategory(cat);
      setReferenceElement(e.currentTarget);
      if (update) setTimeout(() => update(), 0);
    },
    [update],
  );

  const handleMouseLeavePopper = useCallback(() => {
    setHoveredCategory(null);
    setReferenceElement(null);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setHoveredCategory(null);
      setReferenceElement(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const hasSubcategories = useCallback((category: Category): boolean => {
    return (
      Array.isArray(category.subcategories) && category.subcategories.length > 0
    );
  }, []);

  const renderCategoryItem = useCallback(
    (category: Category) => {
      const Icon =
        categoryIconMap[category.category_name] || UniversalFallbackIcon;
      const isActive = hoveredCategory?.id === category.id;
      const hasSubcats = hasSubcategories(category);

      return (
        <div
          key={category.id}
          onMouseEnter={(e: ReactMouseEvent<HTMLElement>) =>
            handleMouseEnterCategory(category, e)
          }
        >
          <Link
            href={`/cat/${slugify(category.category_name)}`}
            onClick={handleItemClick}
          >
            <div
              className={`py-2 px-3 rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-between ${isActive
                ? 'bg-gray-100 text-primary_1 shadow-sm'
                : 'hover:bg-gray-50 hover:text-primary_1'
                }`}
            >
              <div className="flex items-center gap-2 truncate">
                <div className="bg-primary_2 p-1 rounded">
                  {category.image_url ? (
                    <img src={category.image_url} alt={category.category_name} className="h-5 w-5 object-contain" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate max-w-[160px]">
                    {category.category_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {category.category_item_count} ads
                  </span>
                </div>
              </div>
              {hasSubcats ? (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              ) : (
                <span className="text-xs italic text-gray-400">No subcats</span>
              )}
            </div>
          </Link>
        </div>
      );
    },
    [
      hoveredCategory,
      handleMouseEnterCategory,
      handleItemClick,
      hasSubcategories,
    ],
  );

  const renderSubcategoryItem = useCallback(
    (subcat: Subcategory) => {
      const IconComponent =
        (subcategoryIconMap[
          subcat.subcategory_name
        ] as React.ComponentType<any>) || UniversalFallbackIcon;
      return (
        <Link key={subcat.id} href={subcat.href} onClick={handleItemClick}>
          <div className="py-2 px-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center">
            {subcat.image_url ? (
              <img src={subcat.image_url} alt={subcat.subcategory_name} className="h-5 w-5 mr-2 object-contain" />
            ) : (
              <IconComponent className="h-5 w-5 mr-2" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[160px]">
                {subcat.subcategory_name}
              </span>
              <span className="text-xs text-gray-500">{subcat.count} ads</span>
            </div>
          </div>
        </Link>
      );
    },
    [handleItemClick],
  );

  const renderSubcategoriesContent = useCallback(() => {
    if (!hoveredCategory) return null;

    const hasSubcats = hasSubcategories(hoveredCategory);

    return (
      <div className="p-3">
        <h3 className="px-2 py-1 text-sm font-semibold text-primary_1 border-b border-gray-200 mb-2">
          {hoveredCategory.category_name} Subcategories
        </h3>
        {hasSubcats ? (
          <div className="space-y-1">
            {(hoveredCategory.subcategories ?? []).map((subcat: Subcategory) =>
              renderSubcategoryItem(subcat),
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No subcategories available</p>
            <p className="text-xs text-gray-400 mt-1">
              Browse all items in {hoveredCategory.category_name}
            </p>
          </div>
        )}
      </div>
    );
  }, [hoveredCategory, renderSubcategoryItem, hasSubcategories]);

  return (
    <>
      {isLoading ? (
        <SidebarSkeleton />
      ) : categories.length === 0 ? (
        <CustomizableNoData
          title="No Categories Available"
          description="Sorry, we couldn't find any categories to display at the moment."
          containerClassName="p-8 text-center"
        />
      ) : (
        <div ref={containerRef} className="relative w-full lg:w-[288px]">
          <Card className="w-full">
            <CardContent className="p-0">
              <ScrollArea className="h-[700px]">
                <div className="p-3">
                  <h3 className="px-2 py-1 text-sm font-semibold text-primary_1 border-b border-gray-200 mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((cat: Category) => renderCategoryItem(cat))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          {hoveredCategory && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              onMouseLeave={handleMouseLeavePopper}
              className="z-50 bg-white border border-gray-200 rounded-md shadow-md w-auto lg:w-[288px]"
            >
              <ScrollArea className="max-h-[400px] overflow-auto">
                {renderSubcategoriesContent()}
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;
