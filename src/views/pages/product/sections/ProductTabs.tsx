'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Description from './Description';
import Reviews from './Reviews';
import { ProductType } from '@/views/pages/product/types/product';

interface ProductTabsProps {
  product: ProductType;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8 h-auto">
        <TabsTrigger value="description" className="h-10">
          Description
        </TabsTrigger>
        <TabsTrigger value="reviews" className="h-10">
          Reviews ({product.reviews?.length || 0})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <Description product={product} />
      </TabsContent>
      <TabsContent value="reviews">
        <Reviews product={product as any} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
