import { openApiClient } from '@/@core/utils/apiClient';

/**
 * Get shop data from API
 * @param url API endpoint
 * @param body Request body
 */
export const getShopData = async (
  url: string,
  body: { user_id: number },
): Promise<any> => {
  const response = await openApiClient.post(url, body);
  return response.data;
};
