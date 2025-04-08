'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoplayPlugin from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import CustomImage from '@/components/shared/CustomImage';
import { formatCurrency } from '@/@core/utils/CurrencyFormatter';
import { usePromotedProducts } from '@core/hooks/useProductData';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, MapPin } from 'lucide-react';
import { useDispatch } from '@/redux-store/hooks';
import { useRouter } from 'next/navigation';
import { setSelectedProduct } from '@/redux-store/slices/products/productSlice';
import { slugify } from '@/@core/utils/slugify';

export function ProductCarousel() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { productsData, isLoading, isError } = usePromotedProducts();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, skipSnaps: false },
    [AutoplayPlugin({ delay: 5000, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse">
        <div className="h-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="w-full md:w-1/2 h-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full h-[400px] bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-semibold text-red-900">
            Error Loading Products
          </h3>
          <p className="mt-1 text-sm text-red-500">
            Failed to load promoted products.
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!productsData.length) return null;

  return (
    <div className="relative h-[400px] overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {productsData.map((item: any) => {
            // Only show location if it contains at least one alphabetic character.
            const locationDisplay =
              item.location && /[A-Za-z]/.test(item.location)
                ? item.location
                : null;
            return (
              <div key={item.id} className="relative flex-[0_0_100%] h-full">
                <div className="absolute inset-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="space-y-1 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {item.category} • {item.subcategory}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm md:text-base line-clamp-2">
                      {item.description}
                    </p>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-lg md:text-xl font-bold text-primary_1">
                          {formatCurrency(item.price)}
                        </span>
                        {locationDisplay && (
                          <span className="text-sm text-gray-500 flex items-center line-clamp-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {locationDisplay}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 items-center">
                        <Button
                          asChild
                          onClick={() => {
                            dispatch(setSelectedProduct(item.id as any));
                            router.push(`/prod/${slugify(item.name)}`);
                          }}
                          className="bg-gray-700 cursor-pointer hover:bg-gray-700/90"
                        >
                          <span>View Details</span>
                        </Button>
                        {item.item_negotiable && (
                          <span className="text-sm font-medium text-green-600">
                            Negotiable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 relative bg-gray-100">
                    <CustomImage
                      src={item.images[0]?.image_url || '/placeholder.png'}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {productsData.map((_: any, index: any) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-gray-700 w-4' : 'bg-gray-300'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
