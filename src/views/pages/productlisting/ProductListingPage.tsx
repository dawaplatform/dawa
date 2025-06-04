'use client';

import { normalizeProducts } from '@/@core/utils/normalizeProductData';
import CardLayout from '@/components/features/listings/CardLayout';
import ProductCardSkeleton from '@/components/features/listings/loaders/ProductCardSkeleton';
import CustomizableNoData from '@/components/shared/no-data';
import { Button } from '@/components/ui/button';
import { useProductListing } from '@core/hooks/useProductData';
import React, { useRef, useState } from 'react';
import { FaTh, FaThList } from 'react-icons/fa';
import { SimilarItem } from '../product/types/product';

const ProductListingPage: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const { productsData, isLoading, isError } = useProductListing();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Normalize the raw product data.
  const normalizedProductsData = normalizeProducts(productsData);

  // When loading, show a full grid of skeleton cards.
  if (isLoading) {
    return (
      <ProductCardSkeleton
        ITEMS_PER_PAGE={16}
        gridClass={`grid grid-cols-2 ${
          viewType === 'grid'
            ? 'sm:grid-cols-3 md:grid-cols-4'
            : 'sm:grid-cols-1'
        } gap-3`}
      />
    );
  }

  // Error state: display a consistent error/no-data message.
  if (isError) {
    return (
      <CustomizableNoData
        title="Error Loading Products"
        description="Something went wrong while fetching products. Please try again later."
        containerClassName="flex flex-col items-center justify-center p-8 text-center w-full"
      />
    );
  }

  // No data state: if no products are available.
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
    <>
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
    </>
  );
};

export default ProductListingPage; 