import mainConfig from '@/@core/configs/mainConfigs';
import Layout from '@/components/layout';
import FAQPage from '@views/pages/faqs/FAQPage';
import { Metadata } from 'next';
import { generatePageMetadata, generateFAQSchema } from '@/@core/utils/seo';
import { getFaqs } from '@/app/server/faqs_newLetter_contactUs/api';
import Script from 'next/script';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Frequently Asked Questions (FAQs) - Dawa.Ug',
    description:
      'Find answers to common questions about Dawa.Ug marketplace. Learn how to buy, sell, post ads, and use our platform effectively in Uganda.',
    path: '/faqs',
  });
}

export default async function page() {
  // Fetch FAQs for structured data
  let faqs: Array<{ question: string; answer: string }> = [];
  try {
    const faqsData = await getFaqs();
    const faqsArray = Array.isArray(faqsData)
      ? faqsData
      : faqsData?.data || [];

    faqs = faqsArray.map((faq: any) => ({
      question: faq.question || '',
      answer: faq.answer || '',
    }));
  } catch (error) {
    console.error('Error fetching FAQs for schema:', error);
  }

  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  return (
    <>
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
      <Layout addFooter={false}>
        <main className={`${mainConfig.maxWidthClass}`}>
          <FAQPage />
        </main>
      </Layout>
    </>
  );
}
