'use client';

import React, { useCallback } from 'react';
import { Trash2, ExternalLink, Share2, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CustomImage from '@/components/shared/CustomImage';
import { useRouter } from 'next/navigation';
import { slugify } from '@/@core/utils/slugify';
import { useWishlist } from '@/contexts/WishlistContext';
import type { ProductCardProps } from '@/views/pages/wishlist/types/wishList';
import { CurrencyFormatter } from '@/@core/utils/CurrencyFormatter';
import { formatDate } from '@/@core/utils/dateFormatter';
import { setSelectedProduct } from '@/redux-store/slices/products/productSlice';
import { useDispatch } from '@/redux-store/hooks';
import { encrypt } from '@/@core/utils/crypto';

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { removeItem } = useWishlist();

  // Create the encrypted share URL
  const createShareUrl = useCallback((): string => {
    // Convert product.id to string if needed
    const encryptedId = encrypt(String(product.id));
    // Build the URL using window.location.origin (this runs on client)
    return `${window.location.origin}/prod?p=${encodeURIComponent(encryptedId)}`;
  }, [product.id]);

  const handleShare = useCallback(() => {
    const url = createShareUrl();
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description ?? '',
          url,
        })
        .catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Error copying link', error));
    }
  }, [createShareUrl, product.name, product.description]);

  const handleViewDetails = useCallback(() => {
    dispatch(setSelectedProduct(product.id as any));
    router.push(`/prod/${slugify(product.name)}`);
  }, [router, product, dispatch]);

  const handleRemoveFromWishlist = useCallback(() => {
    removeItem(product.id);
  }, [removeItem, product.id]);
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Product Image */}
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
            <CustomImage
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex justify-between gap-2">
              <div className="space-y-2 flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 hidden sm:block">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleRemoveFromWishlist}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Date & Pricing */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <span className="text-sm text-gray-500 flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                Posted {formatDate(product.dateAdded)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold text-primary_1">
                <CurrencyFormatter price={product.price as any} />
              </span>
            </div>

            {/* Like Button & View Details */}
            <div className="pt-2 flex items-center justify-between">
              <div></div>
              <button
                onClick={handleViewDetails}
                className="flex items-center gap-1 px-3 py-2 border rounded text-xs sm:text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
