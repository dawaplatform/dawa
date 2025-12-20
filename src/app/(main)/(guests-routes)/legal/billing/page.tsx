import BillingPage from '@views/pages/legal/billingPage';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Billing Policy - Dawa.Ug',
  description:
    'Learn about Dawa.Ug\'s billing policy, payment terms, and subscription packages for promoting your products on our marketplace.',
  path: '/legal/billing',
});

const page = () => {
  return <BillingPage />;
};

export default page;
