'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Tag } from 'lucide-react';
import { CurrencyFormatter } from '@/@core/utils/CurrencyFormatter';
import { formatDate } from '@/@core/utils/dateFormatter';
import { ProductType } from '@/views/pages/product/types/product';

interface ProductInfoProps {
  product: ProductType;
}

export const ProductInfo: React.FC<ProductInfoProps> = React.memo(
  ({ product }) => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm space-y-4">
        {/* Price */}
        <h2 className="text-3xl font-extrabold text-primary_1">
          <CurrencyFormatter price={Number(product.price)} />
        </h2>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{product.location}</span>
        </div>

        {/* Product Title */}
        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

        {/* Badges and Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Negotiable or Fixed Price */}
            <Badge variant="secondary" className="text-xs flex items-center">
              {product.item_negotiable ? (
                <>
                  <Tag className="h-3 w-3 mr-1" />
                  Negotiable
                </>
              ) : (
                'Fixed Price'
              )}
            </Badge>

            {/* Status (Available or not) */}
            <Badge
              variant="secondary"
              className={`text-xs ${
                product.status === 'Available'
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {product.status}
            </Badge>
          </div>

          {/* Posted Date */}
          <span className="text-sm text-gray-500 flex items-center">
            <CalendarDays className="w-4 h-4 mr-1" />
            Posted {formatDate(product.created_at)}
          </span>
        </div>
      </div>
    );
  },
);

ProductInfo.displayName = 'ProductInfo';
