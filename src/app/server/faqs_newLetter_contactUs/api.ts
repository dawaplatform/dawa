import {
  ContactUsPayload,
  SubscribePayload,
} from '@/views/pages/contact-us/contact-us';
import { openApiClient } from '@/@core/utils/apiClient';

/**
 *  Get FAQs
 *  @returns {Promise<any>}
 */
export const getFaqs = async () => {
  const response = await openApiClient.get('/getfaqs/');
  return response.data;
};

/**
 *  Subscribe to newsletter
 *  @param {string} key - API key
 *  @param {SubscribePayload} arg - Subscribe payload
 *  @returns {Promise<any>}
 */
export const subscribeToNewsletter = async (
  key: string,
  { arg }: { arg: SubscribePayload },
): Promise<any> => {
  const response = await openApiClient.post('/subscribe/', arg);
  return response.data;
};

/**
 *  Contact us
 *  @param {string} key - API key
 *  @param {ContactUsPayload} arg - Contact us payload
 *  @returns {Promise<any>}
 */
export const contactUs = async (
  key: string,
  { arg }: { arg: ContactUsPayload },
): Promise<any> => {
  const response = await openApiClient.post('/contactus/', arg);
  return response.data;
};
