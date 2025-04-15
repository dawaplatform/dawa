'use client';

import React, { useRef, useState } from 'react';
import { useProductsData } from '@core/hooks/useProductData';
import { OopsComponent } from '@/components/shared/oops-component';
import { SimilarItem } from '@/views/pages/product/types/product';
import { normalizeProducts } from '@/@core/utils/normalizeProductData';
import useInfiniteScroll from '@/@core/hooks/useInfiniteScroll';
import SingleSkeletonCard from '@/components/features/listings/loaders/SingleSkeletonCard';
import ProductCardSkeleton from '@/components/features/listings/loaders/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { FaTh, FaThList } from 'react-icons/fa';
import CardLayout from '@/components/features/listings/CardLayout';

const ProductPage: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const { productsData, isLoading, isError, nextPageUrl, size, setSize } =
    useProductsData({});
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Normalize the raw product data.
  const normalizedProductsData = normalizeProducts(productsData);

  // Use the custom infinite scroll hook.
  useInfiniteScroll(
    loadMoreRef,
    () => {
      setSize((prevSize: number) => prevSize + 1);
    },
    { threshold: 1, enabled: !!nextPageUrl && !isLoading },
  );

  // While the first page is loading, display a full grid of skeletons.
  if (isLoading && size === 1) {
    return (
      <div>
        <ProductCardSkeleton
          ITEMS_PER_PAGE={16}
          gridClass={`grid grid-cols-2 ${viewType === 'grid' ? 'sm:grid-cols-3 md:grid-cols-4' : 'sm:grid-cols-1'} gap-3`}
        />
      </div>
    );
  }

  // If an error occurred, show an error component.
  if (isError) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary_1">
          Trending Products
        </h2>
        <OopsComponent />
      </div>
    );
  }

  // Assume a 4-column grid layout.
  const columns = 4;
  const productCount = normalizedProductsData.length;
  const remainder = productCount % columns;
  const fillCount = remainder > 0 ? columns - remainder : 0;
  // Additionally, add one extra full row of skeleton cards.
  const additionalSkeletonCount = columns;
  const totalSkeletonCount = fillCount + additionalSkeletonCount;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary_1">Trending Products</h2>
        <div className="hidden items-center gap-2 md:flex">
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
      <div
        className={`grid grid-cols-2 ${viewType === 'grid' ? 'sm:grid-cols-3 md:grid-cols-4' : 'sm:grid-cols-1'} gap-3`}
      >
        {normalizedProductsData.map((product, index) => (
          <CardLayout
            key={`${product.id}-${index}`}
            product={product as unknown as SimilarItem}
            viewType={viewType}
          />
        ))}
        {isLoading &&
          size > 1 &&
          Array.from({ length: totalSkeletonCount }).map((_, index) => (
            <SingleSkeletonCard key={`skeleton-${index}`} />
          ))}
      </div>
      {/* Sentinel element: when visible, triggers loading the next page */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default ProductPage;
