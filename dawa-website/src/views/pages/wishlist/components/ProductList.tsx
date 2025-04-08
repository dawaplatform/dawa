'use client';

import React, { FC } from 'react';
import ProductCard from './ProductCard';
import SkeletonProductCard from './SkeletonProductCard';
import type { Product } from '@/views/pages/wishlist/types/wishList';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductList: FC<ProductListProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return <SkeletonProductCard />;
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default React.memo(ProductList);
