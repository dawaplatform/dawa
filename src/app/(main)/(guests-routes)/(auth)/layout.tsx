import Layout from '@/components/layout';
import GuestOnlyRoute from '@/@core/hocs/GuestOnlyRoute';
export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestOnlyRoute>
      <Layout addFooter={false}>{children}</Layout>
    </GuestOnlyRoute>
  );
}
