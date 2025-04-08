import { secureApiClient } from '@/@core/utils/apiClient';

/**
 * Fetches the user's wishlist.
 *
 * @returns The wishlist extracted from the API response.
 */
export const getUserWishList = async (): Promise<any> => {
  const response = await secureApiClient.get('/getuserwishlist/');
  // Adjust this extraction according to your API's response shape.
  return response.data.wishlist;
};

/**
 * Toggles (adds or removes) an item from the user's wishlist.
 *
 * @param url - The endpoint URL.
 * @param param1 - An object with a property `arg` containing { item_id: string }.
 * @returns The API response data.
 */
export const toggleWishlistItem = async (
  url: string,
  { arg }: { arg: { item_id: string } },
): Promise<any> => {
  const response = await secureApiClient.post(url, arg);
  return response.data;
};
