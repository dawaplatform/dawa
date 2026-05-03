import mainConfig from '@/@core/configs/mainConfigs';
import Layout from '@/components/layout';
import { CategoriesMenuListing } from '@/views/pages/category/components/categories-menu-listing';
import ProductListingPage from '@/views/pages/productlisting/ProductListingPage';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(
  () => import('@/views/pages/category/components/Sidebar'),
);

export default function ProductListingRoute() {
  return (
    <Layout>
      <div className={`flex flex-col ${mainConfig.maxWidthClass} gap-12`}>
        {/* Mobile/Tablet Categories Menu - Only show on screens smaller than lg */}
        <section className="lg:hidden">
          <CategoriesMenuListing />
        </section>
        <section>
          <div className="flex gap-4">
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-[100px] z-40">
                <Sidebar />
              </div>
            </div>
            <div className="flex-grow min-w-0 z-30">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">All Products</h1>
              <ProductListingPage />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
