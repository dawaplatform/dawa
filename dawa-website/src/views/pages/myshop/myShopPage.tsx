'use client';

import { useState, useEffect, useMemo } from 'react';
import { useShopData } from '@core/hooks/useProductData';
import { useDispatch, useSelector } from '@/redux-store/hooks';
import { setSelectedUserId } from '@/redux-store/slices/myshop/selectedUserSlice';
import { ShopHeader } from './components/shop-header';
import { ShopContent } from './components/shop-content';
import { ShopSkeleton } from './components/shop-skeleton';
import type { FilterOption } from './types/types';
import { useAuth } from '@/@core/hooks/use-auth';
import { OopsComponent } from '@/components/shared/oops-component';
import CustomizableNoData from '@/components/shared/no-data';

const MyShop: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const selectedUserId = useSelector((state) => state.myShop.userId);
  const { shopData, isLoading, isError, mutate } = useShopData(selectedUserId);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterOption, setFilterOption] = useState<FilterOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([
    0, 1000000000,
  ]);
  const [appliedLocation, setAppliedLocation] = useState('');
  const [appliedSelectedColors, setAppliedSelectedColors] = useState<string[]>(
    [],
  );

  // If Redux does not have a selectedUserId, try to get it from localStorage.
  useEffect(() => {
    if (!selectedUserId) {
      const storedId = localStorage.getItem('selectedShopId');
      if (storedId) {
        dispatch(setSelectedUserId(storedId));
      }
    }
  }, [dispatch, selectedUserId]);

  // Set the selected user id only if it's not already set and if the current user is available.
  useEffect(() => {
    if (!selectedUserId && user?.id) {
      dispatch(setSelectedUserId(user.id));
    }
  }, [dispatch, selectedUserId, user]);

  // Fix the type error by explicitly casting the mapped category value to a string.
  const categories = useMemo(() => {
    if (!shopData?.items?.item_details) return ['all'];
    const uniqueCategories: string[] = Array.from(
      new Set(
        shopData.items.item_details.map((item: any) => item.category as string),
      ),
    );
    return ['all', ...uniqueCategories];
  }, [shopData?.items?.item_details]);

  const handleFilterChange = (value: FilterOption) => {
    setFilterOption(value);
  };

  const handleApplyFilters = (
    priceRange: [number, number],
    location: string,
    selectedColors: string[],
  ) => {
    setAppliedPriceRange(priceRange);
    setAppliedLocation(location);
    setAppliedSelectedColors(selectedColors);
  };

  const handleResetFilters = () => {
    setAppliedPriceRange([0, 1000000000]);
    setAppliedLocation('');
    setAppliedSelectedColors([]);
    setSelectedCategory('all');
    setFilterOption('default');
  };

  // Determine if the current user is the shop owner (admin).
  // (Adjust this logic as needed. For example, you might compare user.id with selectedUserId.)
  const isAdmin = user?.id === selectedUserId;

  if (isLoading) {
    return <ShopSkeleton />;
  }

  if (isError) {
    return <OopsComponent />;
  }

  if (!shopData) {
    return (
      <CustomizableNoData
        title="No Data Found"
        description="There are no items in shop yet."
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div>
        <ShopHeader
          user={shopData.user_profile}
          stats={shopData.items}
          isAdmin={isAdmin}
        />
        <ShopContent
          shopData={shopData}
          viewType={viewType}
          setViewType={setViewType}
          filterOption={filterOption}
          handleFilterChange={handleFilterChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          appliedPriceRange={appliedPriceRange}
          appliedLocation={appliedLocation}
          appliedSelectedColors={appliedSelectedColors}
          handleApplyFilters={handleApplyFilters}
          handleResetFilters={handleResetFilters}
          isAdmin={isAdmin}
          mutate={mutate}
        />
      </div>
    </div>
  );
};

export default MyShop;
