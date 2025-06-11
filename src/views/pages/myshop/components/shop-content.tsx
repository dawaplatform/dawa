'use client';

import FiltersAndSorting from '@/components/features/filters/FiltersAndSorting';
import ProductFilter from '@/components/features/filters/ProductFilter';
import CardLayout from '@/components/features/listings/CardLayout';
import { EditAdvertSheet } from '@/components/shared/edit-advert-sheet'; // adjust the path as needed
import CustomizableNoData from '@/components/shared/no-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SimilarItem } from '@/views/pages/product/types/product';
import React, { useState } from 'react';
import type { FilterOption, ShopData } from '../types/types';

interface ShopContentProps {
  shopData: ShopData;
  viewType: 'grid' | 'list';
  setViewType: (type: 'grid' | 'list') => void;
  filterOption: FilterOption;
  handleFilterChange: (value: FilterOption) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  appliedPriceRange: [number, number];
  appliedLocation: string;
  appliedSelectedColors: string[];
  handleApplyFilters: (
    priceRange: [number, number],
    location: string,
    selectedColors: string[],
  ) => void;
  handleResetFilters: () => void;
  isAdmin?: boolean;
  mutate: () => void;
}

const transformItemToSimilarItem = (item: any): SimilarItem => {
  return {
    ...item,
    images: item.images || [{ image_url: '/placeholder.jpg' }],
    seller: item.seller || {},
    reviews: item.reviews ?? 0,
    similar_items: item.similar_items || [],
    rating: item.rating ?? 0,
    features: item.features || [],
    originalPrice: item.originalPrice || item.item_price,
  };
};

export const ShopContent: React.FC<ShopContentProps> = ({
  shopData,
  viewType,
  setViewType,
  filterOption,
  handleFilterChange,
  selectedCategory,
  setSelectedCategory,
  categories,
  appliedPriceRange,
  appliedLocation,
  appliedSelectedColors,
  handleApplyFilters,
  handleResetFilters,
  isAdmin = false,
  mutate,
}) => {
  // State to control the EditAdvertSheet
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<SimilarItem | null>(null);

  // onEdit callback for cards
  const handleEdit = (product: SimilarItem) => {
    setSelectedProductForEdit(product);
    setEditSheetOpen(true);
  };

  const filteredItems = shopData.items.item_details.filter((item) => {
    const matchesPrice =
      Number(item.item_price) >= appliedPriceRange[0] && Number(item.item_price) <= appliedPriceRange[1];
    const matchesLocation = appliedLocation
      ? item.item_location === appliedLocation
      : true;
    const matchesColor =
      appliedSelectedColors.length === 0 ||
      (item.color && appliedSelectedColors.includes(item.color));
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesPrice && matchesLocation && matchesColor && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (filterOption) {
      case 'price_low_to_high':
        return Number(a.item_price) - Number(b.item_price);
      case 'price_high_to_low':
        return Number(b.item_price) - Number(a.item_price);
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-[88px] space-y-6">
              <ScrollArea className="lg:h-[calc(100vh-180px)]">
                <ProductFilter
                  appliedPriceRange={appliedPriceRange}
                  appliedLocation={appliedLocation}
                  appliedSelectedColors={appliedSelectedColors}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                />
              </ScrollArea>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <FiltersAndSorting
                category={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={(cat) => setSelectedCategory(cat)}
                categoryTitle="Filter by Category"
                viewType={viewType}
                setViewType={setViewType}
                filterOption={filterOption}
                handleFilterChange={handleFilterChange}
                arrowVisible={true}
                autoScroll={true}
              />
            </div>

            {sortedItems.length === 0 ? (
              <CustomizableNoData
                title="No items found"
                description="Sorry, we couldn't find any items that match your criteria. Please try again with different filters."
              />
            ) : (
              <div
                className={`grid grid-cols-2 ${viewType === 'grid' ? 'sm:grid-cols-3 md:grid-cols-4' : 'sm:grid-cols-1'} gap-3`}
              >
                {sortedItems.map((item) => {
                  const transformedItem = transformItemToSimilarItem(item);
                  return (
                    <CardLayout
                      key={item.id}
                      product={transformedItem}
                      viewType={viewType}
                      onEdit={handleEdit}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedProductForEdit && (
        <EditAdvertSheet
          key={selectedProductForEdit.id}
          isOpen={editSheetOpen}
          onClose={() => setEditSheetOpen(false)}
          item={selectedProductForEdit}
          onUpdate={() => {
            mutate();
          }}
        />
      )}
    </>
  );
};
