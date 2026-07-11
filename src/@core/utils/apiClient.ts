import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

type ApiClientType = 'secure' | 'open';

type HeadersConfig = {
  isMultipart?: boolean;
};

const createApiClient = (
  type: ApiClientType,
  headersConfig?: HeadersConfig,
): AxiosInstance => {
  // For multipart requests, do not set Content-Type manually.
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: headersConfig?.isMultipart
      ? {}
      : { 'Content-Type': 'application/json' },
  });

  if (type === 'secure') {
    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Token ${session.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  return instance;
};

export const secureApiClient = createApiClient('secure');
export const openApiClient = createApiClient('open');
export const secureMultipartApiClient = createApiClient('secure', {
  isMultipart: true,
});

export type MessageSendError = {
  title: string;
  message: string;
  isBlocked: boolean;
};

/**
 * Parse errors from POST /sendmessage/, including Gemini safety blocks
 * that return `{ error, reason, status: 400 }`.
 */
export function getMessageSendError(error: unknown): MessageSendError {
  const err = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        error?: string;
        detail?: string;
        reason?: string;
      };
    };
    message?: string;
  };

  const data = err?.response?.data;
  const reason = data?.reason;
  const isBlocked = err?.response?.status === 400 && Boolean(reason);

  if (isBlocked) {
    return {
      title: 'Message Blocked',
      message: `${data?.error || data?.message || 'Your message was flagged as unsafe and could not be sent.'}\n\n${reason}`,
      isBlocked: true,
    };
  }

  return {
    title: 'Error',
    message:
      data?.error ||
      data?.message ||
      data?.detail ||
      err?.message ||
      'Failed to send the message. Please try again.',
    isBlocked: false,
  };
}
