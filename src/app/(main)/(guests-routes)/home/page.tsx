import Layout from '@/components/layout';
import HomePage from '@views/pages/home/HomePage';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/@core/utils/seo';
import Script from 'next/script';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/@core/utils/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Dawa.Ug - Buy and Sell in Uganda | Marketplace',
  description:
    'Buy and sell in Uganda. Dawa.Ug is your trusted marketplace for finding great deals on products and services across Uganda. Browse thousands of listings, post your items for free, and connect with buyers and sellers.',
  path: '/home',
});

export default function Page() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Layout>
        <HomePage />
      </Layout>
    </>
  );
}
