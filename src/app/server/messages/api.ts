import { SendMessagePayload } from '@/views/pages/messages/types/message';
import { secureApiClient } from '@/@core/utils/apiClient';

/**
 * Sends a message.
 * @param url - The endpoint URL.
 * @param param1 - An object with a property `arg` containing the message payload.
 * @returns The API response data.
 */
export const sendMessage = async (
  url: string,
  { arg }: { arg: SendMessagePayload },
): Promise<any> => {
  const response = await secureApiClient.post(url, arg);
  return response.data;
};

/**
 * Retrieves messages.
 * @returns The API response data containing messages.
 */
export const getMessages = async (): Promise<any> => {
  const response = await secureApiClient.get('/getchatswithmessages/');
  return response.data;
};
