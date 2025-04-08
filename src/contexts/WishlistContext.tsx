'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSWRConfig } from 'swr';
import useSWR from 'swr';
import { getUserWishList, toggleWishlistItem } from '@/app/server/wishList/api';
import { swrOptions } from '@/@core/configs/swrConfig';
import { useAuth } from '@core/hooks/use-auth';
import type { Product } from '@/views/pages/wishlist/types/wishList';
import { normalizeProduct } from '@/@core/utils/normalizeProduct';

interface WishlistContextProps {
  rawWishlist: Product[];
  wishlist: string[];
  wishlistCount: number;
  isLoading: boolean;
  toggle: (productId: string, productData?: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refetchWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { mutate: globalMutate } = useSWRConfig();

  const { data, isLoading, mutate } = useSWR(
    user ? 'userWishlist' : null,
    getUserWishList,
    swrOptions,
  );

  // Use useMemo to stabilize the rawWishlist array.
  const rawWishlist: Product[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const ids = rawWishlist.map((item) => item.id);
    if (JSON.stringify(ids) !== JSON.stringify(wishlist)) {
      setWishlist(ids);
    }
  }, [rawWishlist, wishlist]);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const toggle = useCallback(
    async (productId: string, productData?: Product) => {
      if (!user) return;
      const currentlyInWishlist = isInWishlist(productId);

      setWishlist((prev) =>
        currentlyInWishlist
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );
      globalMutate(
        'userWishlist',
        (existingData: Product[] = []) => {
          if (!Array.isArray(existingData)) return [];
          if (currentlyInWishlist) {
            return existingData.filter((item) => item.id !== productId);
          } else {
            // Normalize the productData here.
            const newItem = productData
              ? normalizeProduct(productData)
              : {
                  id: productId,
                  name: '',
                  price: '',
                  originalPrice: '0',
                  discount: 0,
                  image: '',
                  rating: 0,
                  orders: 0,
                  dateAdded: new Date().toISOString(),
                  description: '',
                };
            return [...existingData, newItem];
          }
        },
        false,
      );

      try {
        await toggleWishlistItem('/wishunwish/', {
          arg: { item_id: productId },
        });
        mutate();
      } catch (err) {
        console.error(err);
        setWishlist((prev) =>
          currentlyInWishlist
            ? [...prev, productId]
            : prev.filter((id) => id !== productId),
        );
        globalMutate('userWishlist');
      }
    },
    [user, isInWishlist, globalMutate, mutate],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!user || !isInWishlist(productId)) return;

      setWishlist((prev) => prev.filter((id) => id !== productId));
      globalMutate(
        'userWishlist',
        (existingData: Product[] = []) => {
          if (!Array.isArray(existingData)) return [];
          return existingData.filter((item) => item.id !== productId);
        },
        false,
      );
      try {
        await toggleWishlistItem('/wishunwish/', {
          arg: { item_id: productId },
        });
        mutate();
      } catch (err) {
        console.error(err);
        setWishlist((prev) => [...prev, productId]);
        globalMutate('userWishlist');
      }
    },
    [user, isInWishlist, globalMutate, mutate],
  );

  const refetchWishlist = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <WishlistContext.Provider
      value={{
        rawWishlist,
        wishlist,
        wishlistCount: wishlist.length,
        isLoading,
        toggle,
        removeItem,
        isInWishlist,
        refetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextProps => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
