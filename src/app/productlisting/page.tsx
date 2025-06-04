import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/Navbar';
import { CategoriesMenu } from '@/views/pages/category/components/categories-menu';
import ProductListingPage from '@/views/pages/productlisting/ProductListingPage';

export default function ProductListingRoute() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavBar />
      <main className="flex-1 flex flex-col gap-8 px-2 sm:px-4 max-w-7xl mx-auto w-full pt-24 pb-8">
        <section>
          <CategoriesMenu />
        </section>
        <section>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">All Products</h1>
          <ProductListingPage />
        </section>
      </main>
      <Footer />
    </div>
  );
} 