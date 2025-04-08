'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchProducts } from '@/@core/hooks/useProductData';
import { normalizeProducts } from '@/@core/utils/normalizeProductData';
import CardLayout from '@/components/features/listings/CardLayout';
import ProductFilter from '@/components/features/filters/ProductFilter';
import FiltersAndSorting from '@/components/features/filters/FiltersAndSorting';
import CustomizableNoData from '@/components/shared/no-data';
import { OopsComponent } from '@/components/shared/oops-component';
import Loader from '@/components/features/loaders/SubLoader';

const SearchPage: React.FC = () => {
  // Get query param from URL.
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  // Use search hook.
  const { searchQuery, productsData, isLoading, isError } =
    useSearchProducts(queryParam);

  // Filter criteria states.
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([
    0, 1_000_000_000,
  ]);
  const [appliedLocation, setAppliedLocation] = useState<string>('');
  const [appliedSelectedColors, setAppliedSelectedColors] = useState<string[]>(
    [],
  );

  // View type and sorting.
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterOption, setFilterOption] = useState<string>('default');

  // Category filter state.
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handlers for filter changes.
  const handleFilterChange = useCallback(
    (value: string) => setFilterOption(value),
    [],
  );
  const handleCategorySelect = useCallback(
    (category: string) => setSelectedCategory(category),
    [],
  );
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
  const handleResetFilters = useCallback(() => {
    setAppliedPriceRange([0, 1_000_000_000]);
    setAppliedLocation('');
    setAppliedSelectedColors([]);
  }, []);

  // Normalize products.
  const normalizedProducts = useMemo(
    () => normalizeProducts(productsData || []),
    [productsData],
  );

  // Derive unique categories and add "all" as the first option.
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    normalizedProducts.forEach((product) => {
      if (product.category) cats.add(product.category);
    });
    return ['all', ...Array.from(cats)];
  }, [normalizedProducts]);

  // Filtering logic.
  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((product) => {
      const price = Number(product.price);
      if (price < appliedPriceRange[0] || price > appliedPriceRange[1])
        return false;

      if (appliedLocation && product.location) {
        if (
          !product.location
            .toLowerCase()
            .includes(appliedLocation.toLowerCase())
        )
          return false;
      }

      if (appliedSelectedColors.length > 0) {
        const productColors: string[] = (product as any).colors || [];
        if (
          !appliedSelectedColors.some((color) => productColors.includes(color))
        )
          return false;
      }

      if (
        selectedCategory !== 'all' &&
        (product.category ?? '').toLowerCase() !==
          selectedCategory.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [
    normalizedProducts,
    appliedPriceRange,
    appliedLocation,
    appliedSelectedColors,
    selectedCategory,
  ]);

  // Sorting logic.
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
        // Newest first based on dateAdded.
        products.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
    }
    return products;
  }, [filteredProducts, filterOption]);

  // If loading, show a global loader.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader />
      </div>
    );
  }

  // If there is no error and no products found, show the No Data component for the whole page.
  if (!isLoading && !isError && sortedProducts.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <CustomizableNoData
          title="No products found"
          description="Sorry, we couldn't find any products that match your search criteria."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {searchQuery || queryParam}
        </h1>
      </header>
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Product Filters */}
          <aside className="lg:col-span-1">
            <ProductFilter
              appliedPriceRange={appliedPriceRange}
              appliedLocation={appliedLocation}
              appliedSelectedColors={appliedSelectedColors}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Main Content: Filters & Product List */}
          <section className="lg:col-span-3 space-y-6">
            <FiltersAndSorting
              category={uniqueCategories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              categoryTitle="Filter by Category"
              viewType={viewType}
              setViewType={setViewType}
              filterOption={filterOption}
              handleFilterChange={handleFilterChange}
              arrowVisible={true}
              autoScroll={true}
            />

            {isError ? (
              <OopsComponent />
            ) : (
              <div
                className={`grid gap-3 mt-6 ${
                  viewType === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {sortedProducts.map((product) => (
                  <CardLayout
                    key={product.id}
                    product={product as any}
                    viewType={viewType}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
