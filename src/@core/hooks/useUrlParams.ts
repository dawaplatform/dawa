'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Returns a setter that updates one query param and drops it when empty. */
export function useUrlParamSetter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );
}

/** Text input state mirrored to a query param after a short debounce. */
export function useUrlSearchParam(key: string, delayMs = 300) {
  const urlValue = useSearchParams().get(key) ?? '';
  const setParam = useUrlParamSetter();
  const [value, setValue] = useState(urlValue);
  const lastWritten = useRef(urlValue);

  useEffect(() => {
    if (urlValue === lastWritten.current) return;
    lastWritten.current = urlValue;
    setValue(urlValue);
  }, [urlValue]);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === lastWritten.current) return;
    const timer = setTimeout(() => {
      lastWritten.current = trimmed;
      setParam(key, trimmed);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [value, key, delayMs, setParam]);

  return [value, setValue] as const;
}
