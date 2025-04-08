'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import CustomImage from '@/components/shared/CustomImage';
import { setSelectedProduct } from '@redux-store/slices/products/productSlice';
import { useDispatch } from '@/redux-store/hooks';
import { slugify } from '@/@core/utils/slugify';
import { LikeButton } from '@/components/shared/LikeButton';
import { CurrencyFormatter } from '@/@core/utils/CurrencyFormatter';
import { Button } from '@/components/ui/button';
import { Edit, MapPin } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SimilarItem } from '@/views/pages/product/types/product';

interface ProductCardProps {
  product: SimilarItem;
  onEdit?: (product: SimilarItem) => void;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onEdit, isAdmin = false }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const image = product.images[0]?.image_url || '/placeholder.jpg';

    // Only display location if it contains alphabetic characters.
    const locationDisplay =
      product.location && /[A-Za-z]/.test(product.location)
        ? product.location
        : null;

    // Navigate to product details after storing product ID.
    const handleCardClick = () => {
      dispatch(setSelectedProduct(product.id as any));
      router.push(`/prod/${slugify(product.name)}`);
    };

    // Prevent propagation for edit button.
    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onEdit && onEdit(product);
    };

    // Prevent propagation for like button.
    const handleLikeClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    };

    return (
      <Card
        onClick={handleCardClick}
        className="overflow-hidden cursor-pointer w-full max-w-[280px] transition-shadow hover:shadow-lg h-full"
      >
        <CardContent className="p-0 relative">
          <div className="relative aspect-square w-full">
            <CustomImage
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-none"
              containerClassName="rounded-none"
            />
            <div className="absolute bottom-2 flex justify-end gap-1 w-full px-2">
              {isAdmin && onEdit && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditClick}
                        className="z-10 pointer-events-auto bg-white h-8 w-8 md:h-10 md:w-10 shadow-lg hover:shadow-xl rounded-full transition-all duration-300"
                        aria-label="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-700" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      align="center"
                      className="bg-gray-900 text-white text-xs px-2 py-1"
                    >
                      Edit product
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div
                onClick={handleLikeClick}
                className="z-10 pointer-events-auto"
              >
                <LikeButton productId={product.id} product={product as any} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start m-0 p-2 space-y-1">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          <p className="text-primary_1 font-semibold text-sm">
            <CurrencyFormatter price={Number(product.price)} />
          </p>
          {locationDisplay && (
            <div className="flex items-center text-xs text-gray-500 line-clamp-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{locationDisplay}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  },
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
