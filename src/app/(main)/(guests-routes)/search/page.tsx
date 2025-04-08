import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';
import SearchPage from '@/views/pages/search/searchPage';

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
