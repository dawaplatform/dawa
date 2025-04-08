'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { slugify } from '@/@core/utils/slugify';
import { useSelector } from '@/redux-store/hooks';
import { selectCategories } from '@/redux-store/slices/categories/categories';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ExtendedSubcategory {
  subcategory_name: string;
  subcategory_item_count: number;
}

interface ExtendedCategory {
  category_name: string;
  category_item_count: number;
  subcategories: ExtendedSubcategory[];
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  categoryName?: string;
  subcategoryName?: string;
  productName?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  categoryName,
  subcategoryName,
  productName,
}) => {
  const categories = useSelector(selectCategories) as ExtendedCategory[];

  // Build the breadcrumb trail based on the current category/subcategory.
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [{ name: 'Home', href: '/home' }];

    let selectedCategory: ExtendedCategory | undefined;
    let selectedSubcategory: ExtendedSubcategory | undefined;

    if (categoryName) {
      const targetCatSlug = slugify(categoryName);
      selectedCategory = categories.find(
        (cat) => slugify(cat.category_name) === targetCatSlug,
      );
    }

    if (selectedCategory && subcategoryName) {
      const targetSubSlug = slugify(subcategoryName);
      selectedSubcategory = selectedCategory.subcategories.find(
        (sub) => slugify(sub.subcategory_name) === targetSubSlug,
      );
    }

    if (selectedCategory) {
      items.push({
        name: `${selectedCategory.category_name} (${selectedCategory.category_item_count})`,
        href: `/cat/${slugify(selectedCategory.category_name)}`,
      });
    }

    if (selectedCategory && selectedSubcategory) {
      items.push({
        name: `${selectedSubcategory.subcategory_name} (${selectedSubcategory.subcategory_item_count})`,
        href: `/cat/${slugify(selectedCategory.category_name)}/${slugify(
          selectedSubcategory.subcategory_name,
        )}`,
      });
    }

    return items;
  }, [categories, categoryName, subcategoryName]);

  // Render the breadcrumb list (used in both desktop and mobile).
  const renderBreadcrumbContent = () => (
    <ul className="flex flex-wrap gap-2 items-center">
      {breadcrumbItems.map((item, index) => {
        const isLastItem = index === breadcrumbItems.length - 1 && !productName;
        return (
          <li key={index} className="flex items-center">
            {isLastItem ? (
              <span
                className="text-gray-500 whitespace-nowrap"
                title={item.name}
              >
                {item.name}
              </span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="hover:underline text-primary_1 font-medium whitespace-nowrap"
                  title={item.name}
                >
                  {item.name}
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </>
            )}
          </li>
        );
      })}
      {productName && (
        <li className="flex items-center">
          <span className="text-gray-800 whitespace-nowrap" title={productName}>
            {productName}
          </span>
        </li>
      )}
    </ul>
  );

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      {/* Desktop Version */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <div className="flex items-center min-w-max">
            {renderBreadcrumbContent()}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="sm:hidden">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-10 justify-between px-4 bg-white border border-gray-200 shadow-sm"
            >
              <span className="font-medium text-gray-800">
                {productName || subcategoryName || categoryName || 'Home'}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-md border border-gray-200 p-4 bg-white shadow">
            {renderBreadcrumbContent()}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
