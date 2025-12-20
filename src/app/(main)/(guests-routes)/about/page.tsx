import Layout from '@/components/layout';
import About_Page from '@views/pages/about/AboutPage';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us - Dawa.Ug',
  description:
    'Learn about Dawa.Ug, Uganda\'s trusted marketplace for buying and selling. Discover our mission, values, and commitment to connecting buyers and sellers across Uganda.',
  path: '/about',
});

const AboutPage = () => {
  return (
    <Layout addFooter={true}>
      <About_Page />
    </Layout>
  );
};

export default AboutPage;
