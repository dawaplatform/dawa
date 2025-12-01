import PrivacyPolicyPage from '@views/pages/legal/privacyPage';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy - Dawa.Ug',
  description:
    'Read Dawa.Ug\'s Privacy Policy to understand how we collect, use, and protect your personal information when you use our marketplace platform.',
  path: '/legal/privacy',
});

const page = () => {
  return <PrivacyPolicyPage />;
};

export default page;
