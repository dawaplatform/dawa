import { useEffect } from 'react';

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
  enabled?: boolean;
}

/**
 * useInfiniteScroll sets up an Intersection Observer on the given ref and triggers the callback when the element is visible.
 *
 * @param ref - A React ref object attached to the sentinel element.
 * @param callback - A function to call when the sentinel becomes visible.
 * @param options - IntersectionObserver options plus an optional `enabled` flag.
 */
const useInfiniteScroll = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  options?: UseInfiniteScrollOptions,
) => {
  useEffect(() => {
    if (!ref.current || options?.enabled === false) return;

    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(ref.current);

    // Cleanup function to disconnect the observer.
    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
};

export default useInfiniteScroll;
