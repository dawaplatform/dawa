'use client';

import React, { FC } from 'react';
import { Heart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WishlistHeaderProps {
  totalItems: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const WishlistHeader: FC<WishlistHeaderProps> = ({
  totalItems,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Header Title & Count */}
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary_1" />
          <h1 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-900">
            My Favorites
          </h1>
          <span className="text-gray-500">({totalItems} items)</span>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-added" className="h-10 cursor-pointer">
              Date Added
            </SelectItem>
            <SelectItem value="price-low" className="h-10 cursor-pointer">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price-high" className="h-10 cursor-pointer">
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default React.memo(WishlistHeader);
