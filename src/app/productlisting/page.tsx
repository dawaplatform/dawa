import mainConfig from '@/@core/configs/mainConfigs';
import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/Navbar';
import { CategoriesMenuListing } from '@/views/pages/category/components/categories-menu-listing';
import ProductListingPage from '@/views/pages/productlisting/ProductListingPage';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(
  () => import('@/views/pages/category/components/Sidebar'),
);

export default function ProductListingRoute() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-12">
      <NavBar />
      <main className={`flex-1 flex flex-col ${mainConfig.maxWidthClass} gap-12 w-full mx-auto px-2 sm:px-4 pt-8 pb-8`}>
        {/* Mobile/Tablet Categories Menu - Only show on screens smaller than lg */}
        <section className="lg:hidden">
          <CategoriesMenuListing />
        </section>
        <section>
          <div className="flex gap-4">
            {/* Desktop Sidebar - Only show on lg and larger screens */}
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
      </main>
      <Footer />
    </div>
  );
} 