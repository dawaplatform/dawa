'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from '@/redux-store/hooks';
import { useProductDetails } from '@/@core/hooks/useProductData';
import { ProductDetails } from './sections/ProductDetails';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import ProductSkeleton from './components/product-skeleton';
import Link from 'next/link';
import { decrypt } from '@/@core/utils/crypto';
import { OopsComponent } from '@/components/shared/oops-component';
import CustomizableNoData from '@/components/shared/no-data';

const ProdPage: React.FC<any> = ({ params }) => {
  // Get the product id from Redux.
  const selectedProductId = useSelector(
    (state) => state.product.selectedProductId,
  ) as string | null;

  // Get the encrypted ID from the query string.
  const searchParams = useSearchParams();
  const encryptedId = searchParams.get('p');
  const productIdFromQuery: string | null = encryptedId
    ? (decrypt(encryptedId) as string)
    : null;

  // Local state to hold the effective product id.
  const [effectiveProductId, setEffectiveProductId] = useState<string | null>(
    null,
  );

  // On mount, determine the effective product id.
  useEffect(() => {
    let prodId: string | null = productIdFromQuery || selectedProductId;
    if (!prodId && typeof window !== 'undefined') {
      prodId = localStorage.getItem('selectedProductId');
    }
    if (prodId) {
      setEffectiveProductId(prodId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedProductId', prodId);
      }
    }
  }, [productIdFromQuery, selectedProductId]);

  const { productData, isLoading, isError } =
    useProductDetails(effectiveProductId);

  if (isLoading) return <ProductSkeleton />;

  if (isError) {
    return <OopsComponent />;
  }

  if (!productData) {
    return (
      <CustomizableNoData
        title="Product not found"
        description="Sorry, we could not find the product you were looking for. Please check the URL or browse our catalog."
        ctaText="Go to Homepage"
        onCtaClick={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <>
      <Breadcrumbs
        categoryName={productData.category}
        subcategoryName={productData.subcategory}
        productName={productData.name}
      />
      <div>
        <ProductDetails product={productData} />
      </div>
    </>
  );
};

export default React.memo(ProdPage);
