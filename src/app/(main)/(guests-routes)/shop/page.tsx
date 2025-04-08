import MyShop from '@/views/pages/myshop/myShopPage';
import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';

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
