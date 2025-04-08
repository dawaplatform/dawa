'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/@core/hooks/use-auth';
import { useDispatch } from '@/redux-store/hooks';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';
import { ProductInfo } from './ProductInfo';
import { SellerInfo } from './SellerInfo';
import { ActionButtons } from './ActionButtons';
import { Sidebar } from './Sidebar';
import { ProductDialogs } from './ProductDialogs';
import type { ProductType } from '@/views/pages/product/types/product';
import { useRouter } from 'next/navigation';
import ImageCarousel from '../components/ImageCarousel';
import ProductTabs from './ProductTabs';
import ShareSection from './ShareSection';
import SimilarProducts from './SimilarProducts';

interface ProductDetailsProps {
  product: ProductType;
}

type DialogType = 'safety' | 'report' | 'message' | 'contact' | 'makeOffer';

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  const [dialogStates, setDialogStates] = useState<Record<DialogType, boolean>>(
    {
      safety: false,
      report: false,
      message: false,
      contact: false,
      makeOffer: false,
    },
  );

  const handleAction = useCallback(
    (action: () => void) => {
      if (!user) {
        dispatch(openAuthDialog());
      } else {
        action();
      }
    },
    [user, dispatch],
  );

  const toggleDialog = useCallback((dialog: DialogType) => {
    setDialogStates((prev) => ({ ...prev, [dialog]: !prev[dialog] }));
  }, []);

  function getValidImageUrl(url: string | undefined, fallback: string): string {
    if (!url) return fallback;
    try {
      // Try to construct a URL. This will throw if the url is invalid.
      new URL(url);
      return url;
    } catch (error) {
      return fallback;
    }
  }

  return (
    <>
      <section>
        {/* Main grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,250px] gap-6">
          {/* Left column - main content */}
          <div className="space-y-8">
            {/* Images and details in grid row */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-8">
              {/* Product images section */}
              <div className="w-full">
                {product.images && product.images.length > 0 ? (
                  <ImageCarousel
                    images={product.images.map((img) => ({
                      ...img,
                      image_id: Number(img.image_id), // ensure image_id is a number
                      image_url: getValidImageUrl(
                        img.image_url,
                        '/placeholder-product.png',
                      ),
                    }))}
                  />
                ) : (
                  <p className="text-gray-500">
                    No images available for this product.
                  </p>
                )}
              </div>
              {/* Product details section */}
              <div className="space-y-6">
                <ProductInfo product={product} />
                <SellerInfo
                  seller={product.seller}
                  productId={product.id}
                  reviews={product.reviews}
                />
                <ActionButtons
                  onContact={() => toggleDialog('contact')}
                  onMessage={() => handleAction(() => toggleDialog('message'))}
                  onMakeOffer={() =>
                    handleAction(() => toggleDialog('makeOffer'))
                  }
                />
              </div>
            </div>

            {/* Mobile Sidebar: Rendered only on mobile */}
            <div className="lg:hidden">
              <Sidebar
                productId={product.id}
                onPostAd={() => handleAction(() => router.push('/post-ad'))}
                onSafetyTips={() => toggleDialog('safety')}
                onReportAbuse={() => handleAction(() => toggleDialog('report'))}
              />
            </div>

            {/* Product tabs and share section */}
            <div className="w-full flex flex-col gap-10">
              <ShareSection productId={product.id} title={product.name} />
              <ProductTabs product={product} />
            </div>

            {/* Similar Products Section */}
            <SimilarProducts similarItems={product.similar_items} />
          </div>

          {/* Right column - Desktop Sidebar (only on large screens) */}
          <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <Sidebar
              productId={product.id}
              onPostAd={() => handleAction(() => router.push('/post-ad'))}
              onSafetyTips={() => toggleDialog('safety')}
              onReportAbuse={() => handleAction(() => toggleDialog('report'))}
            />
          </div>
        </div>
      </section>

      <ProductDialogs
        product={product}
        dialogStates={dialogStates}
        toggleDialog={toggleDialog}
      />
    </>
  );
};

export default React.memo(ProductDetails);
