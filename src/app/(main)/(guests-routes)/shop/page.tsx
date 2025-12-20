import MyShop from '@/views/pages/myshop/myShopPage';
import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'My Shop - Dawa.Ug',
  description:
    'Manage your shop on Dawa.Ug. View your listings, track performance, and manage your products in one place.',
  path: '/shop',
});

const page = () => {
  return (
    <Layout addFooter={false}>
      <main className={`${mainConfig.maxWidthClass} min-h-dvh`}>
        <MyShop />
      </main>
    </Layout>
  );
};

export default page;
