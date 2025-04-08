'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import type {
  Category,
  Subcategory,
} from '@/views/pages/category/types/category';
import { slugify } from '@/@core/utils/slugify';
import SidebarSkeleton from './SidebarSkeleton';
import {
  categoryIconMap,
  subcategoryIconMap,
  UniversalFallbackIcon,
} from './icon-maps';

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
    subcategories: rawCat.subcategories
      ? rawCat.subcategories.map((sub: any) => ({
          id: sub.id,
          subcategory_name: sub.subcategory_name,
          name: sub.subcategory_name, // display name
          count: sub.subcategory_item_count || 0, // use subcategory_item_count from JSON
          icon: sub.icon || '', // fallback icon if provided
          href: `/cat/${slugify(rawCat.category_name)}/${slugify(
            sub.subcategory_name,
          )}`,
        }))
      : [],
  };
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  // Local state for categories loaded from JSON.
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Local state for hovered category.
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  // Track if screen is large (>= 1024px).
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  // Fetch categories from the JSON file.
  useEffect(() => {
    fetch('/categories.json')
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((cat: any) => transformCategory(cat));
        setCategories(transformed);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Update screen size state.
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When an item is selected, call onSelect if provided.
  const handleItemClick = useCallback(() => {
    if (onSelect) onSelect();
  }, [onSelect]);

  // On large screens, set the hovered category.
  const handleCategoryMouseEnter = useCallback(
    (category: Category) => {
      if (isLargeScreen) {
        setHoveredCategory(category);
      }
    },
    [isLargeScreen],
  );

  // Clear hovered category when mouse leaves.
  const handleSidebarMouseLeave = useCallback(() => {
    setHoveredCategory(null);
  }, []);

  // Render a single category item.
  const renderCategoryItem = useCallback(
    (category: Category) => {
      const Icon =
        categoryIconMap[category.category_name] || UniversalFallbackIcon;
      const isActive = hoveredCategory?.id === category.id;

      return (
        <Link
          key={category.id}
          href={`/cat/${slugify(category.category_name)}`}
          onClick={handleItemClick}
        >
          <div
            className={`py-2 px-1 rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-between ${
              isActive
                ? 'bg-gray-100 text-primary_1'
                : 'hover:bg-gray-50 hover:text-primary_1'
            }`}
            onMouseEnter={() => handleCategoryMouseEnter(category)}
          >
            <div className="flex items-center gap-2 w-full truncate">
              <div className="bg-primary_2 p-1 mr-2 rounded-md">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate max-w-[180px]">
                  {category.category_name}
                </span>
                <span className="text-xs text-gray-500">
                  {category.category_item_count} ads
                </span>
              </div>
            </div>
            {isLargeScreen && (
              <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
            )}
          </div>
        </Link>
      );
    },
    [hoveredCategory, isLargeScreen, handleItemClick, handleCategoryMouseEnter],
  );

  // Render a single subcategory item.
  const renderSubcategoryItem = useCallback(
    (subcat: Subcategory) => {
      const IconComponent =
        (subcategoryIconMap[
          subcat.subcategory_name
        ] as React.ComponentType<any>) || UniversalFallbackIcon;
      return (
        <Link key={subcat.id} href={subcat.href} onClick={handleItemClick}>
          <div className="p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center">
            <IconComponent className="h-4 w-4 mr-2" />
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[180px]">
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

  if (isLoading) return <SidebarSkeleton />;
  if (!categories || categories.length === 0) return <SidebarSkeleton />;

  return (
    <div
      className="relative w-full lg:w-[288px]"
      onMouseLeave={handleSidebarMouseLeave}
    >
      {/* Use gap-4 (or your preferred spacing) to separate the two columns */}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Category Sidebar */}
        <Card className="w-full lg:w-[288px]">
          <CardContent className="p-0">
            <ScrollArea className="h-[700px]">
              <div className="p-4 space-y-1 divide-y divide-gray-300">
                {categories.map((cat) => renderCategoryItem(cat))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Subcategory Sidebar (for large screens) */}
        {isLargeScreen && hoveredCategory && (
          <Card className="min-w-[288px]">
            <CardContent className="p-0">
              <ScrollArea className="h-[700px]">
                <div className="p-4 space-y-1 divide-y divide-gray-300">
                  {(hoveredCategory?.subcategories ?? []).map((subcat) =>
                    renderSubcategoryItem(subcat),
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
