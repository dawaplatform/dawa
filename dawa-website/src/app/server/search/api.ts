import { openApiClient } from '@/@core/utils/apiClient';

/**
 * Search for items using the open API
 * @param query The search query
 * @param signal An optional AbortSignal to cancel the request
 * @returns A Promise that resolves to the search results
 */
export const search = async (query: string) => {
  const response = await openApiClient.post('/searchitems/', {
    search_query: query,
  });
  return response.data;
};
