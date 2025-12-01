import TermsPage from '@views/pages/legal/termsPage';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service - Dawa.Ug',
  description:
    'Read Dawa.Ug\'s Terms of Service to understand the rules and guidelines for using our marketplace platform in Uganda.',
  path: '/legal/terms',
});

const page = () => {
  return <TermsPage />;
};

export default page;
