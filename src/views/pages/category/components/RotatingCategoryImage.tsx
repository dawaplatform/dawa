'use client';

import { thumbnailUrl } from '@/@core/utils/categoryImage';
import React, { useEffect, useState } from 'react';

interface RotatingCategoryImageProps {
  urls: string[];
  alt: string;
  /** Rendered size in px, used to request a small thumbnail. */
  size: number;
  /** Stable per-category value so icons don't all change at the same moment. */
  seed: string | number;
  className?: string;
  intervalMs?: number;
}

function hash(value: string | number): number {
  let h = 0;
  for (const ch of String(value)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

const RotatingCategoryImage: React.FC<RotatingCategoryImageProps> = ({
  urls,
  alt,
  size,
  seed,
  className,
  intervalMs = 4000,
}) => {
  const count = urls.length;
  const [index, setIndex] = useState(() => (count ? hash(seed) % count : 0));

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    // Stagger start so a column of icons doesn't flip in unison.
    const start = setTimeout(() => {
      interval = setInterval(() => {
        if (!document.hidden) setIndex((i) => (i + 1) % count);
      }, intervalMs);
    }, hash(seed) % intervalMs);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [count, seed, intervalMs]);

  useEffect(() => {
    if (count < 2) return;
    const next = new window.Image();
    next.src = thumbnailUrl(urls[(index + 1) % count], size);
  }, [index, count, urls, size]);

  if (!count) return null;
  const src = thumbnailUrl(urls[index % count], size);

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      loading="lazy"
      className={`animate-in fade-in duration-500 ${className ?? ''}`}
    />
  );
};

export default RotatingCategoryImage;
