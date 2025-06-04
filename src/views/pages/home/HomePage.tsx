import { ProductCarousel } from '@/components/features/carousels/product-carousel';
import { Button } from '@/components/ui/button';
import TrendingProducts from '@/views/pages/home/TrendingProducts';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 px-2 sm:px-4 max-w-7xl mx-auto">
      {/* Premium Section Carousel */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Premium Section</h2>
        <ProductCarousel />
      </section>

      {/* Trending Products */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Trending Products</h2>
        <TrendingProducts />
      </section>

      {/* All Products Link */}
      <section className="flex justify-end">
        <Button asChild>
          <Link href="/productlisting">View All Products</Link>
        </Button>
      </section>
    </div>
  );
}
