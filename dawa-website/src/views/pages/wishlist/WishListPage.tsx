'use client';

import React, { useState, useMemo, useCallback } from 'react';
import WishlistHeader from './components/WishlistHeader';
import ProductList from './components/ProductList';
import Button from '@/components/shared/Button';
import { useWishlist } from '@/contexts/WishlistContext';
import type { Product } from '@/views/pages/wishlist/types/wishList';
import { normalizeProduct } from '@/@core/utils/normalizeProduct';
import CustomizableNoData from '@/components/shared/no-data';

const WishlistPage = () => {
  const { rawWishlist, isLoading } = useWishlist();

  const [sortBy, setSortBy] = useState<string>('date-added');
  const [visibleProducts, setVisibleProducts] = useState<number>(10);

  // Normalize each item in rawWishlist.
  const products: Product[] = useMemo(() => {
    return rawWishlist.map(normalizeProduct);
  }, [rawWishlist]);

  const sortedProducts: Product[] = useMemo(() => {
    const copy = [...products];
    switch (sortBy) {
      case 'price-low':
        return copy.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-high':
        return copy.sort((a, b) => Number(b.price) - Number(a.price));
      case 'orders':
        return copy.sort((a, b) => (b.orders ?? 0) - (a.orders ?? 0));
      case 'date-added':
      default:
        return copy.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
    }
  }, [products, sortBy]);

  const displayedProducts = useMemo(
    () => sortedProducts.slice(0, visibleProducts),
    [sortedProducts, visibleProducts],
  );

  const handleLoadMore = useCallback(() => {
    setVisibleProducts((prev) => prev + 10);
  }, []);

  return (
    <>
      <WishlistHeader
        totalItems={sortedProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ProductList products={displayedProducts} isLoading={isLoading} />

      {visibleProducts < sortedProducts.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} className="min-w-[200px]">
            Load More
          </Button>
        </div>
      )}

      {!isLoading && sortedProducts.length === 0 && (
        <CustomizableNoData
          title="No products found."
          description="You don't have any products in your wishlist yet."
        />
      )}
    </>
  );
};

export default WishlistPage;
