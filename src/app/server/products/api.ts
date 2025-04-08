import {
  secureApiClient,
  openApiClient,
  secureMultipartApiClient,
} from '@/@core/utils/apiClient';
import {
  ProductUploadProps,
  TrendingProductsResponse,
} from '@/views/pages/product/types/product';
import { ReportAbuseProps } from '@/views/pages/product/types/reportAbuse';

/**
 * Fetch categories list
 * @returns {Promise<any>}
 */
export const getCategoriesList = async (): Promise<any> => {
  try {
    const response = await openApiClient.get('/getcategories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch subcategories list
 * @returns {Promise<any>}
 */
export const getCategoryData = async (body: any): Promise<any> => {
  try {
    const response = await openApiClient.post('/getitems/', body);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch trending products
 * @returns {Promise<TrendingProductsResponse>}
 */
export const getProductsList = async (
  url: string,
  body: any = {},
): Promise<TrendingProductsResponse> => {
  try {
    const response = await openApiClient.post(url, body);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch product details
 * @returns {Promise<any>}
 */
export const getProductDetails = async (body: any): Promise<any> => {
  try {
    const response = await openApiClient.post('/getitemdetails/', body);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

/**
 * Fetch promoted products list
 * @returns {Promise<any>}
 */
export const getPromotedProductsList = async (): Promise<any> => {
  try {
    const response = await openApiClient.get('/getitemspromoted/');
    return response.data;
  } catch (error) {
    console.error('Error fetching promoted products:', error);
    throw error;
  }
};

/**
 * Fetch search results
 * @returns {Promise<any>}
 */
export const getSearchResults = async (
  url: string,
  body: any = {},
): Promise<any> => {
  try {
    const response = await openApiClient.post(url, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add new product
 * @returns {Promise<any>}
 */
export const addNewProduct = async (
  url: string,
  { arg }: { arg: ProductUploadProps },
): Promise<any> => {
  return secureMultipartApiClient
    .post(url, arg)
    .then((response) => response.data);
};

/**
 * Update product
 * @returns {Promise<any>}
 */
export const updateProduct = async (
  url: string,
  { arg }: { arg: ProductUploadProps },
): Promise<any> => {
  return secureMultipartApiClient
    .patch(url, arg)
    .then((response) => response.data);
};

/**
 * Delete product
 * @returns {Promise<any>}
 */
export const deleteProduct = async (
  url: string,
  { arg }: { arg: any },
): Promise<any> => {
  return secureApiClient
    .delete(url, { data: arg })
    .then((response) => response.data);
};

/**
 * Delete product image
 * @returns {Promise<any>}
 * @param url
 * @param arg
 */
export const deleteProductImage = async (
  url: string,
  { arg }: { arg: any },
): Promise<any> => {
  return secureApiClient
    .delete(url, { data: arg })
    .then((response) => response.data);
};

/**
 * Report abuse
 * @returns {Promise<any>}
 * @param url
 * @param arg
 */
export const reportAbuse = async (
  url: string,
  { arg }: { arg: ReportAbuseProps },
): Promise<any> => {
  return secureApiClient.post(url, arg).then((response) => response.data);
};

/**
 * Send review
 * @returns {Promise<any>}
 * @param url
 * @param arg
 * @param productId
 */
export const sendReview = async (
  url: string,
  { arg }: { arg: any },
): Promise<any> => {
  return secureApiClient.post(url, arg).then((response) => response.data);
};
