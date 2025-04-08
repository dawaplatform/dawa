'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  FC,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CardLayout from '@/components/features/listings/CardLayout';
import ProductFilter from '@/components/features/filters/ProductFilter';
import FiltersAndSorting from '@/components/features/filters/FiltersAndSorting';
import CategoriesAndSubcategories from '@/views/pages/category/components/CategoriesAndSubcategories';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import CustomizableNoData from '@/components/shared/no-data';
import { OopsComponent } from '@/components/shared/oops-component';

import { slugify } from '@/@core/utils/slugify';
import {
  setSelectedCategory,
  setSelectedSubcategory,
} from '@redux-store/slices/categories/categorySlice';
import { useProductsData } from '@core/hooks/useProductData';

import type {
  Category,
  Subcategory,
} from '@/views/pages/category/types/category';
import ProductCardSkeleton from '@/components/features/listings/loaders/ProductCardSkeleton';
import useInfiniteScroll, {
  UseInfiniteScrollOptions,
} from '@/@core/hooks/useInfiniteScroll';
import SingleSkeletonCard from '@/components/features/listings/loaders/SingleSkeletonCard';
import { normalizeProducts } from '@/@core/utils/normalizeProductData';

type FilterOptionType =
  | 'default'
  | 'rating'
  | 'price_low_to_high'
  | 'price_high_to_low';
type ViewType = 'grid' | 'list';

interface ExtendedSubcategory extends Subcategory {
  subcategory_item_count: number;
}

interface ExtendedCategory extends Category {
  category_item_count: number;
  subcategories: ExtendedSubcategory[];
}

interface CategoryPageProps {
  category: string[];
}

const CategoryPage: FC<CategoryPageProps> = ({ category }) => {
  const dispatch = useDispatch();

  // Get categories from Redux.
  const categories = useSelector(
    (state: any) => state.categories.categories,
  ) as ExtendedCategory[];

  // View and sorting states.
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [filterOption, setFilterOption] = useState<FilterOptionType>('default');

  // Filter criteria states.
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([
    0, 1000000000,
  ]);
  const [appliedLocation, setAppliedLocation] = useState<string>('');
  const [appliedSelectedColors, setAppliedSelectedColors] = useState<string[]>(
    [],
  );

  // Derive selected category from the URL slug.
  const selectedCategory = useMemo(() => {
    return categories.find(
      (cat) => slugify(cat.category_name) === slugify(category[0] || ''),
    );
  }, [categories, category]);

  // Derive selected subcategory.
  const selectedSubcategory = useMemo(() => {
    return selectedCategory?.subcategories.find(
      (sub) => slugify(sub.subcategory_name) === slugify(category[1] || ''),
    );
  }, [selectedCategory, category]);

  // Dispatch global selected values.
  useEffect(() => {
    dispatch(setSelectedCategory(selectedCategory || null));
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    dispatch(setSelectedSubcategory(selectedSubcategory || null));
  }, [selectedSubcategory, dispatch]);

  // Prepare the request body for the products API.
  const productsBody = useMemo(() => {
    if (selectedSubcategory) {
      return { subcategory_id: selectedSubcategory.id };
    } else if (selectedCategory) {
      return { category_id: selectedCategory.id };
    }
    return null;
  }, [selectedCategory, selectedSubcategory]);

  // Fetch paginated products.
  const {
    productsData,
    nextPageUrl,
    isLoading: isProductsLoading,
    isError: productsError,
    setSize,
  } = useProductsData(productsBody);

  // Normalize the fetched product data.
  const normalizedProductsData = useMemo(() => {
    return normalizeProducts(productsData);
  }, [productsData]);

  // Infinite scroll: attach observer to load more pages.
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(
    loadMoreRef,
    () => {
      setSize((prevSize: number) => prevSize + 1);
    },
    {
      threshold: 1,
      enabled: !!nextPageUrl && !isProductsLoading,
    } as UseInfiniteScrollOptions,
  );

  // Handler for applying filters from the ProductFilter component.
  const handleApplyFilters = useCallback(
    (
      newPriceRange: [number, number],
      newLocation: string,
      newSelectedColors: string[],
    ) => {
      setAppliedPriceRange(newPriceRange);
      setAppliedLocation(newLocation);
      setAppliedSelectedColors(newSelectedColors);
    },
    [],
  );

  // Handler for resetting filters.
  const resetFilters = useCallback(() => {
    setAppliedPriceRange([0, 1000000000]);
    setAppliedLocation('');
    setAppliedSelectedColors([]);
  }, []);

  // Handle sorting option change.
  const handleFilterChange = useCallback((selectedOption: string) => {
    setFilterOption(selectedOption as FilterOptionType);
  }, []);

  // Front-end filtering of the normalized products.
  const filteredProducts = useMemo(() => {
    return normalizedProductsData.filter((product) => {
      // Price filter.
      const price = Number(product.price);
      if (price < appliedPriceRange[0] || price > appliedPriceRange[1]) {
        return false;
      }
      // Location filter (case-insensitive).
      if (
        appliedLocation &&
        product.location &&
        !product.location.toLowerCase().includes(appliedLocation.toLowerCase())
      ) {
        return false;
      }
      // Colors filter (if applicable).
      if (appliedSelectedColors.length > 0) {
        const productColors: string[] = (product as any).colors || [];
        if (
          !appliedSelectedColors.some((color) => productColors.includes(color))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [
    normalizedProductsData,
    appliedPriceRange,
    appliedLocation,
    appliedSelectedColors,
  ]);

  // Sorting logic based on the selected filter option.
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (filterOption) {
      case 'price_low_to_high':
        products.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price_high_to_low':
        products.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        // Default: newest first using dateAdded.
        products.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
        break;
    }
    return products;
  }, [filteredProducts, filterOption]);

  if (!selectedCategory) {
    return null;
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="hidden md:block">
        <Breadcrumbs
          categoryName={selectedCategory.category_name}
          subcategoryName={selectedSubcategory?.subcategory_name}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
        {/* Sidebar */}
        <aside className="flex lg:flex-col gap-6">
          <CategoriesAndSubcategories
            categoryName={selectedCategory.category_name}
            categoryCount={selectedCategory.category_item_count}
            subcategories={selectedCategory.subcategories.map((sub) => ({
              name: sub.subcategory_name,
              count: sub.subcategory_item_count,
            }))}
            parentCategory={category[0]}
          />
          <ProductFilter
            appliedPriceRange={appliedPriceRange}
            appliedLocation={appliedLocation}
            appliedSelectedColors={appliedSelectedColors}
            onApplyFilters={handleApplyFilters}
            onResetFilters={resetFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="space-y-6">
            <FiltersAndSorting
              category={category}
              viewType={viewType}
              setViewType={setViewType}
              filterOption={filterOption}
              handleFilterChange={handleFilterChange}
            />
            {isProductsLoading ? (
              <ProductCardSkeleton
                ITEMS_PER_PAGE={16}
                gridClass={`grid grid-cols-2 ${viewType === 'grid' ? 'sm:grid-cols-3 md:grid-cols-4' : 'sm:grid-cols-1'} gap-3`}
              />
            ) : productsError ? (
              <OopsComponent />
            ) : sortedProducts.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-2 ${viewType === 'grid' ? 'sm:grid-cols-3 md:grid-cols-4' : 'sm:grid-cols-1'} gap-3`}
                >
                  {sortedProducts.map((product, index) => (
                    <CardLayout
                      key={`${product.id}-${index}`}
                      product={product as any}
                      viewType={viewType}
                    />
                  ))}
                  {isProductsLoading &&
                    // Render additional skeleton cards to fill the grid if needed.
                    (() => {
                      const columns = 4;
                      const productCount = sortedProducts.length;
                      const remainder = productCount % columns;
                      const fillCount = remainder > 0 ? columns - remainder : 0;
                      const additionalSkeletonCount = columns;
                      const totalSkeletonCount =
                        fillCount + additionalSkeletonCount;
                      return Array.from({ length: totalSkeletonCount }).map(
                        (_, idx) => (
                          <SingleSkeletonCard key={`skeleton-${idx}`} />
                        ),
                      );
                    })()}
                </div>
                {/* Sentinel element for infinite scroll */}
                <div ref={loadMoreRef} className="h-1" />
              </>
            ) : (
              <CustomizableNoData
                title="No products found"
                description="No products found matching the selected filters."
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CategoryPage;
