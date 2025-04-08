'use client';

import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import useSWRMutation from 'swr/mutation';
import { useCallback, useMemo, useRef, useEffect } from 'react';

// API Methods
import {
  getProductsList,
  getPromotedProductsList,
  getCategoryData,
  addNewProduct,
  getProductDetails,
  reportAbuse,
  sendReview,
  updateProduct,
  deleteProductImage,
} from '@/app/server/products/api';
import { getShopData } from '@/app/server/my-shop/api';
import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
} from '@/app/server/auth/api';
import { getMessages, sendMessage } from '@/app/server/messages/api';
import { SendMessagePayload } from '@/views/pages/messages/types/message';
import {
  ProductUploadProps,
  TrendingProductsResponse,
} from '@/views/pages/product/types/product';
import { ReportAbuseProps } from '@/views/pages/product/types/reportAbuse';
import {
  getFaqs,
  subscribeToNewsletter,
  contactUs,
} from '@/app/server/faqs_newLetter_contactUs/api';
import {
  ContactUsPayload,
  SubscribePayload,
} from '@/views/pages/contact-us/contact-us';
import { search } from '@/app/server/search/api';
import { swrOptions } from '../configs/swrConfig';

/**
 * Removes duplicate products based on their `id` property.
 * @param products - Array of product objects.
 * @returns Array of unique products.
 */
function deduplicateProducts(products: any[]): any[] {
  const uniqueMap = new Map<number, any>();
  products.forEach((product) => {
    uniqueMap.set(product.id, product);
  });
  return Array.from(uniqueMap.values());
}

/**
 * Custom hook to fetch paginated product data.
 * Utilizes SWRInfinite for asynchronous, non-blocking pagination.
 * @param body - Optional request body for filtering products.
 * @returns Object with product data, total count, pagination info, loading status, and mutate functions.
 */
export function useProductsData(body?: any) {
  const bodyKey = useMemo(() => (body ? JSON.stringify(body) : null), [body]);

  // Generate a key for each page request
  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: TrendingProductsResponse | null,
    ): string | null => {
      // If no more pages are available, stop fetching
      if (previousPageData && !previousPageData.next) return null;
      if (pageIndex === 0)
        return bodyKey
          ? `/getitems/?body=${encodeURIComponent(bodyKey)}`
          : '/getitems/';
      return previousPageData!.next;
    },
    [bodyKey],
  );

  const { data, error, size, setSize, mutate } =
    useSWRInfinite<TrendingProductsResponse>(
      getKey,
      (url: string) => getProductsList(url, body),
      {
        revalidateAll: false,
        revalidateOnFocus: false,
        ...swrOptions, // Custom SWR configuration
      },
    );

  // Flatten results from multiple pages and remove duplicates
  const rawProductsData = data ? data.flatMap((page) => page.results.data) : [];
  const productsData = deduplicateProducts(rawProductsData);
  const totalCount = data?.[0]?.count || 0;
  const nextPageUrl = data?.[data.length - 1]?.next || null;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  return {
    productsData,
    totalCount,
    nextPageUrl,
    isLoading: isLoadingMore,
    isError: error,
    mutate,
    size,
    setSize,
  };
}

/**
 * Custom hook to fetch category data.
 * It determines the request body based on the selected category or subcategory.
 * @param params - Object containing `selectedCategory` and `selectedSubcategory`.
 * @returns Object with category data, loading state, error info, and mutate function.
 */
export function useCategoryData({
  selectedCategory,
  selectedSubcategory,
}: any) {
  const body = useMemo(() => {
    if (selectedSubcategory) {
      return { subcategory_id: selectedSubcategory.id };
    } else if (selectedCategory) {
      return { category_id: selectedCategory.id };
    }
    return null;
  }, [selectedCategory, selectedSubcategory]);

  const shouldFetch = body !== null;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['categoryData', JSON.stringify(body)] : null,
    () => getCategoryData(body),
    {
      ...swrOptions,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading, mutate };
}

/**
 * Custom hook to fetch messages.
 * @returns Object with messages data, loading state, error, and mutate function.
 */
export function useMessages() {
  const messagesOptions: SWRConfiguration = {
    ...swrOptions,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  };

  const { data, error, isLoading, mutate } = useSWR(
    'messages',
    getMessages,
    messagesOptions,
  );

  return {
    messagesData: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Custom hook to send a message.
 * @returns Object with a trigger function to send a message, sending state, and error info.
 */
export function useSendMessage() {
  const { trigger, isMutating, error } = useSWRMutation<
    any,
    any,
    string,
    SendMessagePayload
  >('/sendmessage/', sendMessage);

  return {
    sendMessage: trigger,
    isSending: isMutating,
    error,
  };
}

/**
 * Custom hook to add a new product.
 * @returns Object with a trigger function to add a product, loading state, and error info.
 */
export function useAddNewProduct() {
  const { trigger, isMutating, error } = useSWRMutation<
    any,
    any,
    string,
    ProductUploadProps
  >('/additem/', addNewProduct);

  return {
    addProduct: trigger,
    isAdding: isMutating,
    error,
  };
}

/**
 * Custom hook to fetch product details based on an item ID.
 * @param itemId - ID of the product to retrieve details for.
 * @returns Object with product details, loading state, error info, and mutate function.
 */
export const useProductDetails = (itemId: any) => {
  const {
    data: productData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [`/getitemdetails`, itemId],
    async () => {
      const response = await getProductDetails({ item_id: itemId });
      return response;
    },
    swrOptions,
  );

  return {
    productData: productData?.data,
    isError: !!error,
    isLoading,
    mutate,
  };
};

/**
 * Custom hook to fetch promoted products.
 * @returns Object with promoted products data, loading state, error info, and mutate function.
 */
export function usePromotedProducts() {
  const { data, error, isLoading, mutate } = useSWR(
    'promotedProducts',
    getPromotedProductsList,
    swrOptions,
  );

  return {
    productsData: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Custom hook to report abuse for a product.
 * @returns Object with a trigger function to report abuse, loading state, and error info.
 */
export function useReportAbuse() {
  const { trigger, isMutating, error } = useSWRMutation<
    any,
    any,
    string,
    ReportAbuseProps
  >('/makereportofabuse/', reportAbuse);

  return {
    reportAbuse: trigger,
    isLoading: isMutating,
    error,
  };
}

/**
 * Custom hook to send a review for a product.
 * @returns Object with a trigger function to send a review, loading state, and error info.
 */
export function useSendReviews() {
  const { trigger, isMutating, error } = useSWRMutation<any, any, string, any>(
    '/submitreview/',
    sendReview,
  );

  return {
    sendReviews: trigger,
    isLoading: isMutating,
    error,
  };
}

/**
 * Custom hook to fetch the user profile.
 * @returns Object with user profile data, associated items, loading state, error info, and mutate function.
 */
export const useUserProfile = () => {
  const userOptions: SWRConfiguration = {
    ...swrOptions,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  };

  const { data, error, isLoading, mutate } = useSWR<any>(
    '/getuserprofile/',
    fetchUserProfile,
    userOptions,
  );

  return {
    userProfile: data?.data?.user_profile || null,
    items: data?.data?.items || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Custom hook to update the user profile.
 * @returns Object with a trigger function to update the user profile, loading state, and error info.
 */
export function useUpdateUserProfile() {
  const { trigger, isMutating, error } = useSWRMutation<
    any,
    any,
    string,
    FormData
  >('/updateuserprofile/', (_key, { arg }) => updateUserProfile(arg));

  return {
    updateUserProfile: trigger,
    isLoading: isMutating,
    error,
  };
}

/**
 * Custom hook to change the user's password.
 * @returns Object with a trigger function to change the password, loading state, and error info.
 */
export function useChangeUserPassword() {
  const { trigger, isMutating, error } = useSWRMutation<any, any, string, any>(
    '/changepassword/',
    changeUserPassword,
  );

  return {
    changeUserPassword: trigger,
    isLoading: isMutating,
    error,
  };
}

/**
 * Custom hook to update product details.
 * @returns Object with a trigger function to update a product, loading state, and error info.
 */
export const useUpdateProduct = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, any, string, any>(
    '/updateitem/',
    updateProduct,
  );

  return {
    updateProduct: trigger,
    isLoading: isMutating,
    error,
  };
};

/**
 * Custom hook to delete a product image.
 * @returns Object with a trigger function to delete an image, response data, error info, and loading state.
 */
export const useDeleteItemImage = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/deleteitemimage/',
    deleteProductImage,
  );

  return {
    deleteItemImage: trigger,
    data,
    error,
    isMutating,
  };
};

/**
 * Custom hook to fetch shop data for a given user.
 * @param userId - ID of the user whose shop data is requested.
 * @returns Object with shop data, loading state, error info, and mutate function.
 */
export const useShopData = (userId: any) => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    userId ? [`/getshopprofile`, userId] : null,
    () => getShopData('/getshopprofile/', { user_id: userId }),
  );

  return {
    shopData: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Custom hook to fetch FAQs.
 * @returns Object with FAQs data, loading state, error info, and mutate function.
 */
export const useFaqs = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'faqs',
    getFaqs,
    swrOptions,
  );

  return {
    faqsData: data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Custom hook to subscribe to the newsletter.
 * @returns Object with a trigger function to subscribe, loading state, and error info.
 */
export const useSubscribeToNewsletter = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    any,
    any,
    string,
    SubscribePayload
  >('/subscribe/', subscribeToNewsletter);

  return {
    subscribeToNewsletter: trigger,
    isLoading: isMutating,
    error,
  };
};

/**
 * Custom hook to send a "Contact Us" request.
 * @returns Object with a trigger function for contact requests, loading state, and error info.
 */
export const useContactUs = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    any,
    any,
    string,
    ContactUsPayload
  >('/contactus/', contactUs);

  return {
    contactUs: trigger,
    isLoading: isMutating,
    error,
  };
};

/**
 * Custom hook to search for products with proper request cancellation.
 * This hook ensures that only the latest search request is processed.
 * @param query - Search query string.
 * @returns Object with search results, query status, loading state, error info, and mutate function.
 */
export const useSearchProducts = (query: string) => {
  // Only fetch when query is provided
  const { data, error, mutate, isValidating } = useSWR(
    query ? ['search', query] : null,
    () => search(query),
    swrOptions,
  );

  return {
    searchQuery: data?.search_query || '',
    productsData: data?.data || [],
    status: data?.status || 0,
    isLoading: query ? !data && !error : false,
    isError: error,
    mutate,
    isValidating,
  };
};
