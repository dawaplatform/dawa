import mainConfig from '@/@core/configs/mainConfigs';
import Layout from '@/components/layout';
import FAQPage from '@views/pages/faqs/FAQPage';

const page = () => {
  return (
    <Layout addFooter={false}>
      <main className={`${mainConfig.maxWidthClass}`}>
        <FAQPage />
      </main>
    </Layout>
  );
};

export default page;
