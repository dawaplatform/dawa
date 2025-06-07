import { MobileProductCarousel } from '@/components/features/carousels/mobile-product-carousel';

export function MobilePremiumCarousel() {
  return (
    <div className="rounded-lg border bg-background shadow-sm overflow-hidden">
      <h1 className="text-lg font-semibold p-3">Premium Items</h1>
      <div className="px-2 pb-3">
        <MobileProductCarousel />
      </div>
    </div>
  );
} 