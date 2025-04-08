'use client';

import React, { useState, useMemo, FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { slugify } from '@/@core/utils/slugify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FiMenu, FiX } from 'react-icons/fi';
import useWindowSize from '@core/hooks/useWindowSize';

interface Subcategory {
  name: string;
  count: number;
}

interface CategoriesAndSubcategoriesProps {
  categoryName: string;
  categoryCount: number;
  subcategories: Subcategory[];
  parentCategory: string;
}

const CategoriesAndSubcategories: FC<CategoriesAndSubcategoriesProps> = ({
  categoryName,
  categoryCount,
  subcategories,
  parentCategory,
}) => {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { width } = useWindowSize();
  // Use a breakpoint of 1024px to cover mobile and tablet views.
  const isMobile = width < 1024;

  const toggleShowMore = () => setShowMore((prev) => !prev);

  const slugifiedCategoryName = useMemo(
    () => slugify(categoryName),
    [categoryName],
  );

  const isActive = (path: string) => decodeURIComponent(pathname) === path;

  const isCategoryActive = useMemo(() => {
    const decodedPathname = decodeURIComponent(pathname);
    return (
      decodedPathname === `/cat/${slugifiedCategoryName}` ||
      decodedPathname.startsWith(`/cat/${slugifiedCategoryName}/`)
    );
  }, [pathname, slugifiedCategoryName]);

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-gray-700 border border-primary_1 bg-primary_2/20 rounded-md transition-colors"
        >
          <FiMenu className="w-5 h-5" />
          <span>Categories</span>
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="p-0 m-0 w-full h-full max-w-full">
            <div className="space-y-4">
              <DialogHeader className="px-4 py-4 h-16 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <DialogTitle className="text-xl font-semibold">
                  {categoryName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 px-4">
                <p className="text-sm text-gray-600">
                  Explore subcategories in {categoryName}.
                </p>
                <div className="flex flex-col space-y-2">
                  {subcategories
                    .slice(0, showMore ? undefined : 4)
                    .map((subcat) => {
                      const slugifiedSubcat = slugify(subcat.name);
                      const subcatPath = `/cat/${slugifiedCategoryName}/${slugifiedSubcat}`;
                      return (
                        <Link key={subcat.name} href={subcatPath}>
                          <button
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium border transition-colors duration-200 ${
                              isActive(subcatPath)
                                ? 'border-primary_1 bg-primary_1 text-white'
                                : 'border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <span>{subcat.name}</span>
                            <span className="text-xs font-light text-gray-500">
                              {subcat.count} items
                            </span>
                          </button>
                        </Link>
                      );
                    })}
                </div>
                {subcategories.length > 4 && (
                  <button
                    onClick={toggleShowMore}
                    className="mt-4 w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-800 shadow-sm transition-colors duration-200"
                  >
                    {showMore
                      ? 'Show Less'
                      : `Show More (${subcategories.length - 4} more)`}
                  </button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop view: render inline
  return (
    <div className="space-y-4 bg-white border border-gray-200 p-4 rounded-md shadow-sm transition-all duration-300">
      {/* Main Category */}
      <div>
        <Link href={`/cat/${slugifiedCategoryName}`}>
          <h2
            className={`text-lg font-semibold cursor-pointer ${
              isCategoryActive ? 'text-primary_1' : 'text-gray-800'
            } hover:text-primary_1 transition-colors duration-200`}
          >
            {categoryName}{' '}
            <span className="text-sm font-normal text-gray-500">
              ({categoryCount})
            </span>
          </h2>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          Discover subcategories in {categoryName}.
        </p>
      </div>
      {/* Subcategories */}
      <div className="flex flex-col space-y-2">
        {subcategories.slice(0, showMore ? undefined : 4).map((subcat) => {
          const slugifiedSubcat = slugify(subcat.name);
          const subcatPath = `/cat/${slugifiedCategoryName}/${slugifiedSubcat}`;
          return (
            <Link key={subcat.name} href={subcatPath}>
              <button
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium border transition-colors duration-200 ${
                  isActive(subcatPath)
                    ? 'border-primary_1 bg-primary_1 text-white'
                    : 'border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span>{subcat.name}</span>
                <span className="text-xs font-light text-gray-500">
                  {subcat.count} items
                </span>
              </button>
            </Link>
          );
        })}
      </div>
      {subcategories.length > 4 && (
        <button
          onClick={toggleShowMore}
          className="mt-4 w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-800 shadow-sm transition-all duration-200"
        >
          {showMore
            ? 'Show Less'
            : `Show More (${subcategories.length - 4} more)`}
        </button>
      )}
    </div>
  );
};

export default CategoriesAndSubcategories;
