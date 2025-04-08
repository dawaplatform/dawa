import type { SWRConfiguration } from 'swr';

/**
 * Custom SWR configuration to ensure asynchronous data fetching without blocking.
 */
export const swrOptions: SWRConfiguration = {
  // Disable revalidation on focus to prevent unnecessary fetches.
  revalidateOnFocus: false,
  // Disable revalidation on network reconnect.
  revalidateOnReconnect: false,
  // Disable automatic refresh.
  refreshInterval: 0,
  // Set deduplication interval to prevent duplicate requests within 60 seconds.
  dedupingInterval: 60000,
  // Retry failed requests: 2 additional attempts.
  shouldRetryOnError: true,
  errorRetryCount: 2,
  errorRetryInterval: 5000,
  // Custom error retry logic to stop after 2 retries.
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (retryCount >= 2) return;
    setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
  },
};
