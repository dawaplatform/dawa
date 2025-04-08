import Layout from '@/components/layout';

export default function ProdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout addFooter={false}>{children}</Layout>;
}
