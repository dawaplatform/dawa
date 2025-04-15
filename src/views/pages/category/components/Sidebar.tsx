'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';
import Link from 'next/link';
import { usePopper } from 'react-popper';
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
          name: sub.subcategory_name,
          count: sub.subcategory_item_count || 0,
          icon: sub.icon || '',
          href: `/cat/${slugify(rawCat.category_name)}/${slugify(sub.subcategory_name)}`,
        }))
      : [],
  };
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Track the currently hovered category (for showing subcategories).
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  // Refs for Popper and container
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Popper (position the subcategories panel to the right)
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'right-start',
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: 'clippingParents',
          },
        },
        {
          name: 'offset',
          options: {
            // Horizontal gap between categories and subcategories
            offset: [12, 0],
          },
        },
      ],
    },
  );

  // Fetch categories from JSON
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

  // Handle category item clicks
  const handleItemClick = useCallback(() => {
    if (onSelect) onSelect();
  }, [onSelect]);

  // When hovering a category, show subcategories in Popper
  const handleMouseEnterCategory = useCallback(
    (cat: Category, e: ReactMouseEvent<HTMLElement>) => {
      setHoveredCategory(cat);
      setReferenceElement(e.currentTarget as HTMLElement);
      // Recalculate Popper’s position
      if (update) setTimeout(() => update(), 0);
    },
    [update],
  );

  // Hide the subcategory panel if the mouse leaves the popper
  const handleMouseLeavePopper = useCallback(() => {
    setHoveredCategory(null);
    setReferenceElement(null);
  }, []);

  // Close subcategories if click is outside the container
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

  // Render each category item
  const renderCategoryItem = useCallback(
    (category: Category) => {
      const Icon =
        categoryIconMap[category.category_name] || UniversalFallbackIcon;
      const isActive = hoveredCategory?.id === category.id;

      return (
        <div
          key={category.id}
          onMouseEnter={(e) => handleMouseEnterCategory(category, e)}
        >
          <Link
            href={`/cat/${slugify(category.category_name)}`}
            onClick={handleItemClick}
          >
            <div
              className={`py-2 px-3 rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-between
                ${
                  isActive
                    ? 'bg-gray-100 text-primary_1 shadow-sm'
                    : 'hover:bg-gray-50 hover:text-primary_1'
                }
              `}
            >
              <div className="flex items-center gap-2 truncate">
                <div className="bg-primary_2 p-1 rounded">
                  <Icon className="h-5 w-5" />
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
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </div>
          </Link>
        </div>
      );
    },
    [hoveredCategory, handleMouseEnterCategory, handleItemClick],
  );

  // Render each subcategory item
  const renderSubcategoryItem = useCallback(
    (subcat: Subcategory) => {
      const IconComponent =
        (subcategoryIconMap[
          subcat.subcategory_name
        ] as React.ComponentType<any>) || UniversalFallbackIcon;

      return (
        <Link key={subcat.id} href={subcat.href} onClick={handleItemClick}>
          <div className="py-2 px-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center">
            <IconComponent className="h-5 w-5 mr-2" />
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

  // Early returns for loading or empty states
  if (isLoading) return <SidebarSkeleton />;
  if (!categories || categories.length === 0) return <SidebarSkeleton />;

  return (
    <div ref={containerRef} className="relative w-full lg:w-[288px]">
      {/* Main Category Card */}
      <Card className="w-full">
        <CardContent className="p-0">
          <ScrollArea className="h-[700px]">
            <div className="p-3">
              <h3 className="px-2 py-1 text-sm font-semibold text-primary_1 border-b border-gray-200 mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => renderCategoryItem(cat))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Subcategories Popper */}
      {hoveredCategory && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          onMouseLeave={handleMouseLeavePopper}
          className="z-50 bg-white border border-gray-200 rounded-md shadow-md w-auto lg:w-[288px]"
        >
          <ScrollArea className="max-h-[400px] overflow-auto">
            <div className="p-3">
              <h3 className="px-2 py-1 text-sm font-semibold text-primary_1 border-b border-gray-200 mb-2">
                {hoveredCategory.category_name} Subcategories
              </h3>
              <div className="space-y-1">
                {(hoveredCategory.subcategories ?? []).map((subcat) =>
                  renderSubcategoryItem(subcat),
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
