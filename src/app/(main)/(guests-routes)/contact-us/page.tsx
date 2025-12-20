import ContactPage from '@views/pages/contact-us';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - Dawa.Ug',
  description:
    'Get in touch with Dawa.Ug. Have questions, feedback, or need support? Contact our team and we\'ll be happy to help you with your marketplace needs.',
  path: '/contact-us',
});

const page = () => {
  return <ContactPage />;
};

export default page;
