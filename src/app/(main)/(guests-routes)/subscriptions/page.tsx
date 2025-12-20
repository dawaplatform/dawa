import SubscriptionPage from '@/views/pages/subscriptions';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Subscription Packages - Dawa.Ug',
  description:
    'Choose a subscription package to promote your products on Dawa.Ug. Boost visibility and reach more buyers with our premium plans.',
  path: '/subscriptions',
});

const page = () => {
  return <SubscriptionPage />;
};

export default page;
