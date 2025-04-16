import { openApiClient } from '@/@core/utils/apiClient';

/**
 *  Get Product Categories
 *  @returns {Promise<any>}
 */
export const getProductCategories = async () => {
  const response = await openApiClient.get('/getcategories/');
  return response.data.data || [];
};
