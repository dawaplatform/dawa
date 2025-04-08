import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';

export default function ProdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout addFooter={false}>
      <main className={`${mainConfig.maxWidthClass} min-h-dvh`}>
        {children}
      </main>
    </Layout>
  );
}
