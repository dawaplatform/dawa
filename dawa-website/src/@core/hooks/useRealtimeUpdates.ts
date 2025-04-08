import { useEffect, useRef } from 'react';
import { useMessages } from './useProductData';

const POLLING_INTERVAL = 5000; // 5 seconds

export function useRealtimeUpdates() {
  const { messagesData, mutate, isLoading } = useMessages();
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const poll = async () => {
      const currentTime = Date.now();
      // Check if enough time has passed
      if (currentTime - lastUpdateTimeRef.current >= POLLING_INTERVAL) {
        await mutate();
        lastUpdateTimeRef.current = currentTime;
      }
      timeoutRef.current = setTimeout(poll, POLLING_INTERVAL);
    };

    // Start the polling
    timeoutRef.current = setTimeout(poll, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [mutate]);

  return { messagesData, isLoading };
}
