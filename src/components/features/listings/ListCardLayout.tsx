'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import CustomImage from '@/components/shared/CustomImage';
import { AiOutlineCheck } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { LikeButton } from '@/components/shared/LikeButton';
import { setSelectedProduct } from '@redux-store/slices/products/productSlice';
import { useDispatch } from '@/redux-store/hooks';
import { slugify } from '@/@core/utils/slugify';
import { CurrencyFormatter } from '@/@core/utils/CurrencyFormatter';
import { Edit, MapPin } from 'lucide-react';
import type { SimilarItem } from '@/views/pages/product/types/product';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ListLayoutProps {
  product: SimilarItem;
  onEdit?: (product: SimilarItem) => void;
  isAdmin?: boolean;
}

const ListLayout: React.FC<ListLayoutProps> = ({
  product,
  onEdit,
  isAdmin = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const image = product.images[0]?.image_url || '/placeholder.jpg';

  // Only display location if it contains alphabetic characters.
  const locationDisplay =
    product.location && /[A-Za-z]/.test(product.location)
      ? product.location
      : null;

  // Navigate to product detail on card click.
  const handleCardClick = () => {
    dispatch(setSelectedProduct(product.id as any));
    router.push(`/prod/${slugify(product.name)}`);
  };

  // Prevent navigation when clicking the edit button.
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit && onEdit(product);
  };

  // Prevent navigation when clicking the like button.
  const handleLikeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Card
      onClick={handleCardClick}
      className="overflow-hidden transition-shadow hover:shadow-lg w-full cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 md:w-64 aspect-square sm:aspect-auto sm:h-48 md:h-64">
          <CustomImage
            src={image}
            alt={product.name}
            fill
            className="object-cover rounded-none"
            containerClassName="rounded-none"
            sizes="(max-width: 640px) 100vw, 484px"
            priority={false}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between w-full p-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg capitalize truncate">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {product.description}
              </p>
            )}
            {product.features && (
              <ul className="text-sm text-gray-500 mt-2 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AiOutlineCheck className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            {locationDisplay && (
              <div className="flex items-center text-sm text-gray-500 mt-1 line-clamp-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{locationDisplay}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end justify-end mt-4 sm:mt-0 sm:ml-4">
            <div className="flex flex-col items-baseline gap-1">
              <span className="text-primary_1 text-xl font-bold">
                <CurrencyFormatter price={Number(product.price)} />
              </span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              {isAdmin && onEdit && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditClick}
                        className="z-10 pointer-events-auto bg-white h-8 w-8 md:h-10 md:w-10 border border-primary text-primary p-2 rounded transition-all duration-300"
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
                <LikeButton
                  productId={product.id}
                  product={product as any}
                  className="bg-transparent hover:bg-transparent border border-primary text-primary p-2 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ListLayout;
