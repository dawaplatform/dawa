'use client';

import { normalizeProducts } from '@/@core/utils/normalizeProductData';
import CardLayout from '@/components/features/listings/CardLayout';
import ProductCardSkeleton from '@/components/features/listings/loaders/ProductCardSkeleton';
import CustomizableNoData from '@/components/shared/no-data';
import { Button } from '@/components/ui/button';
import useInfiniteScroll from '@core/hooks/useInfiniteScroll';
import { useProductsData } from '@core/hooks/useProductData';
import React, { useRef, useState } from 'react';
import { FaTh, FaThList } from 'react-icons/fa';
import { SimilarItem } from '../product/types/product';

const ITEMS_PER_PAGE = 20;

const ProductListingPage: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Use the paginated hook instead of the simple one
  const { 
    productsData, 
    totalCount, 
    isLoading, 
    isError, 
    size, 
    setSize,
    nextPageUrl 
  } = useProductsData();

  // Normalize the raw product data
  const normalizedProductsData = normalizeProducts(productsData);

  // Setup infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);
  
  useInfiniteScroll(
    observerTarget,
    () => {
      if (nextPageUrl && !isLoading) {
        setSize(size + 1);
      }
    },
    { enabled: !!nextPageUrl && !isLoading }
  );

  // When loading initial data, show skeleton cards
  if (isLoading && normalizedProductsData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant={viewType === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewType('grid')}
              aria-label="View as Grid"
              className={`transition-colors ${
                viewType === 'grid'
                  ? 'text-white bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaTh className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewType('list')}
              aria-label="View as List"
              className={`transition-colors ${
                viewType === 'list'
                  ? 'text-white bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaThList className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ProductCardSkeleton
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          gridClass={`grid grid-cols-2 ${
            viewType === 'grid'
              ? 'sm:grid-cols-3 md:grid-cols-4'
              : 'sm:grid-cols-1'
          } gap-3`}
        />
      </div>
    );
  }

  // Error state: display a consistent error/no-data message
  if (isError) {
    return (
      <CustomizableNoData
        title="Error Loading Products"
        description="Something went wrong while fetching products. Please try again later."
        containerClassName="flex flex-col items-center justify-center p-8 text-center w-full"
      />
    );
  }

  // No data state: if no products are available
  if (!isLoading && normalizedProductsData.length === 0) {
    return (
      <CustomizableNoData
        title="No Products Available"
        description="We couldn't find any products at the moment. Please check back later."
        containerClassName="flex flex-col items-center justify-center p-8 text-center w-full"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with view toggles and product count */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewType('grid')}
            aria-label="View as Grid"
            className={`transition-colors ${
              viewType === 'grid'
                ? 'text-white bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaTh className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewType('list')}
            aria-label="View as List"
            className={`transition-colors ${
              viewType === 'list'
                ? 'text-white bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaThList className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Product count */}
        <div className="text-sm text-gray-600">
          Showing {normalizedProductsData.length} of {totalCount} products
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={`grid grid-cols-2 ${
          viewType === 'grid'
            ? 'sm:grid-cols-3 md:grid-cols-4'
            : 'sm:grid-cols-1'
        } gap-3`}
      >
        {normalizedProductsData.map((product, index) => (
          <CardLayout
            key={`${product.id}-${index}`}
            product={product as unknown as SimilarItem}
            viewType={viewType}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {isLoading && normalizedProductsData.length > 0 && (
        <div className="flex justify-center py-8">
          <ProductCardSkeleton
            ITEMS_PER_PAGE={8}
            gridClass={`grid grid-cols-2 ${
              viewType === 'grid'
                ? 'sm:grid-cols-3 md:grid-cols-4'
                : 'sm:grid-cols-1'
            } gap-3 w-full`}
          />
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="h-4" />

      {/* Load more button (fallback for infinite scroll) */}
      {nextPageUrl && !isLoading && (
        <div className="flex justify-center py-4">
          <Button
            onClick={() => setSize(size + 1)}
            variant="outline"
            className="px-8"
          >
            Load More Products
          </Button>
        </div>
      )}

      {/* End of results indicator */}
      {!nextPageUrl && normalizedProductsData.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          You've reached the end of all products
        </div>
      )}
    </div>
  );
};

export default ProductListingPage; 