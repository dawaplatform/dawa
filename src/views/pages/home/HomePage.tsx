import mainConfig from '@/@core/configs/mainConfigs';
import { Button } from '@/components/ui/button';
import { CategoriesMenu } from '@/views/pages/category/components/categories-menu';
import ProductPage from '@/views/pages/home/TrendingProducts';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const Sidebar = dynamic(
  () => import('@/views/pages/category/components/Sidebar'),
);

export default function HomePage() {
  return (
    <div className={`flex flex-col ${mainConfig.maxWidthClass} gap-12`}>
      <section>
        <CategoriesMenu />
      </section>
      <section className="flex justify-end">
        <Button asChild className="bg-primary_1 text-white rounded-lg px-6 py-2 font-semibold shadow hover:bg-primary_1/90 transition-colors">
          <Link href="/productlisting">View All Products</Link>
        </Button>
      </section>
      <section>
        <div className="flex gap-4">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-[100px] z-40">
              <Sidebar />
            </div>
          </div>
          <div className="flex-grow min-w-0 z-30">
            <ProductPage />
          </div>
        </div>
      </section>
    </div>
  );
}
