import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dawa.ug';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/cat/', // Allow all category pages (including programmatic SEO URLs)
          '/prod/', // Allow all product pages
          '/home',
          '/about',
          '/contact-us',
          '/faqs',
          '/shop',
          '/search',
          '/subscriptions',
          '/legal/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/messages/',
          '/my-shop/',
          '/notifications/',
          '/post-ad/',
          '/wishlist/',
          '/activate/',
          '/unauthorized/',
          '/login',
          '/register',
          '/change-password',
          '/forgot-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/cat/', // Explicitly allow category pages for Googlebot
          '/prod/',
          '/home',
          '/about',
          '/contact-us',
          '/faqs',
          '/shop',
          '/search',
          '/subscriptions',
          '/legal/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/messages/',
          '/my-shop/',
          '/notifications/',
          '/post-ad/',
          '/wishlist/',
          '/activate/',
          '/unauthorized/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

