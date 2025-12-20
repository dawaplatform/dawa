import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';
import SearchPage from '@/views/pages/search/searchPage';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search Products - Dawa.Ug',
  description:
    'Search for products on Dawa.Ug marketplace. Find what you\'re looking for with our powerful search tool.',
  path: '/search',
});

const page = () => {
  return (
    <Layout addFooter={false}>
      <main className={`${mainConfig.maxWidthClass} min-h-dvh`}>
        <SearchPage />
      </main>
    </Layout>
  );
};

export default page;
