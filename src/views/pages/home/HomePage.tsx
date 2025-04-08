import { CategoriesMenu } from '@/views/pages/category/components/categories-menu';
import mainConfig from '@/@core/configs/mainConfigs';
import ProductPage from '@/views/pages/home/TrendingProducts';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(
  () => import('@/views/pages/category/components/Sidebar'),
);

export default function HomePage() {
  return (
    <div className={`flex flex-col ${mainConfig.maxWidthClass} gap-12`}>
      <section>
        <CategoriesMenu />
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
