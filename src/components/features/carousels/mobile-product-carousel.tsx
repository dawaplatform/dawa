'use client';

import { formatCurrency } from '@/@core/utils/CurrencyFormatter';
import { slugify } from '@/@core/utils/slugify';
import CustomImage from '@/components/shared/CustomImage';
import CustomizableNoData from '@/components/shared/no-data';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatch } from '@/redux-store/hooks';
import { setSelectedProduct } from '@/redux-store/slices/products/productSlice';
import { usePremiumSectionItems } from '@core/hooks/useProductData';
import AutoplayPlugin from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function MobileProductCarousel() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { productsData, isLoading, isError } = usePremiumSectionItems();

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

  if (isLoading) {
    return (
      <div className="w-full h-[350px] bg-gray-100 rounded-lg animate-pulse">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <CustomizableNoData
        title="Error Loading Premium Products"
        description="Something went wrong while fetching premium products."
        containerClassName="w-full h-[350px] flex flex-col items-center justify-center p-4 text-center"
      />
    );
  }

  if (!isLoading && (!productsData || !productsData.length)) {
    return (
      <CustomizableNoData
        title="No Premium Products"
        description="There are no premium products available at the moment."
        containerClassName="w-full h-[350px] flex flex-col items-center justify-center p-4 text-center"
      />
    );
  }

  return (
    <div className="relative h-[350px] overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {productsData.map((item: any) => {
            const locationDisplay =
              item.item_location && /[A-Za-z]/.test(item.item_location)
                ? item.item_location
                : null;

            return (
              <div key={item.id} className="relative flex-[0_0_100%] h-full">
                <div className="absolute inset-0 flex flex-col">
                  {/* Image Section - Reduced height to give more space for content */}
                  <div className="h-2/5 relative bg-gray-100">
                    <CustomImage
                      src={item.images[0]?.image_url || '/placeholder.png'}
                      alt={item.item_name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content Section - Increased height and better spacing */}
                  <div className="h-3/5 p-3 flex flex-col justify-between">
                    <div className="space-y-1 flex-1">
                      <span className="text-xs font-medium text-gray-500">
                        {item.category} • {item.subcategory}
                      </span>
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1">
                        {item.item_name}
                      </h3>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {item.item_description}
                      </p>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-primary_1">
                          {formatCurrency(item.item_price)}
                        </span>
                        {item.item_negotiable && (
                          <span className="text-xs font-medium text-green-600">
                            Negotiable
                          </span>
                        )}
                      </div>
                      {locationDisplay && (
                        <span className="text-xs text-gray-500 block">
                          {locationDisplay}
                        </span>
                      )}
                      <Button
                        onClick={() => {
                          dispatch(setSelectedProduct(item.id));
                          router.push(`/prod/${slugify(item.item_name)}`);
                        }}
                        className="w-full bg-gray-700 hover:bg-gray-700/90 text-sm py-2"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation dots - Moved higher to avoid overlap */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 mt-2">
        {productsData.map((_: any, index: number) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-gray-700 w-3' : 'bg-gray-300'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 