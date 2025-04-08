import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout addFooter={false}>
      <div className={`${mainConfig.maxWidthClass}`}>{children}</div>
    </Layout>
  );
}
