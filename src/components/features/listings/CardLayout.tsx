'use client';

import type React from 'react';
import ImportedProductCard from './GridCardLayout';
import ListLayout from './ListCardLayout';
import { SimilarItem } from '@/views/pages/product/types/product';

interface CardLayoutProps {
  product: SimilarItem;
  viewType: 'grid' | 'list';
  onEdit?: (product: SimilarItem) => void;
  isAdmin?: boolean;
}

type ProductCardPropsType = React.ComponentProps<typeof ImportedProductCard>;
const ProductCard = ImportedProductCard as React.FC<ProductCardPropsType>;

const CardLayout: React.FC<CardLayoutProps> = ({
  product,
  viewType,
  onEdit,
  isAdmin = false,
}) => {
  const transformedProduct = { ...product };

  if (viewType === 'grid') {
    return (
      <ProductCard
        product={transformedProduct}
        onEdit={onEdit}
        isAdmin={isAdmin}
      />
    );
  } else {
    return (
      <ListLayout
        product={transformedProduct}
        onEdit={onEdit}
        isAdmin={isAdmin}
      />
    );
  }
};

export default CardLayout;
