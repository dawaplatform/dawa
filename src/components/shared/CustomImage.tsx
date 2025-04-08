'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CustomImageProps extends Omit<NextImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK_IMAGE = '/assets/images/default_image.webp';

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  alt = '',
  quality = 85,
  className,
  containerClassName,
  ...props
}) => {
  // Initialize image source with the provided src or fallback
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Use a ref to track whether the component is mounted
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // When src or fallbackSrc changes, update the image source and reset states.
  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc]);

  // Callback for when the image loads successfully.
  const handleLoadingComplete = useCallback(() => {
    if (mountedRef.current) {
      setIsLoading(false);
    }
  }, []);

  // Callback for handling image loading errors.
  const handleError = useCallback(() => {
    if (!mountedRef.current) return;

    // If the current image is not already the fallback, try loading the fallback.
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    } else {
      // If fallback also fails, mark an error state.
      setIsLoading(false);
      setHasError(true);
    }
  }, [fallbackSrc, imgSrc]);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden rounded-lg',
        containerClassName,
      )}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
      )}
      {!hasError && (
        <NextImage
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={quality}
          className={cn(
            'object-cover object-center w-full h-full transition-opacity duration-300 rounded-lg',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default CustomImage;
