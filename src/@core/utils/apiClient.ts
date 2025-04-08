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
