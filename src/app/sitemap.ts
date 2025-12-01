import { MetadataRoute } from 'next';
import { getProductCategories } from '@/app/server/categories/api';
import { openApiClient } from '@/@core/utils/apiClient';
import { slugify } from '@/@core/utils/slugify';
import { SEO_KEYWORDS, POPULAR_LOCATIONS } from '@/@core/configs/seoKeywords';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dawa.ug';

// Static pages configuration
const staticPages = [
  { url: '/home', priority: 1.0, changefreq: 'daily' },
  { url: '/about', priority: 0.8, changefreq: 'monthly' },
  { url: '/contact-us', priority: 0.7, changefreq: 'monthly' },
  { url: '/faqs', priority: 0.7, changefreq: 'monthly' },
  { url: '/shop', priority: 0.9, changefreq: 'daily' },
  { url: '/subscriptions', priority: 0.6, changefreq: 'monthly' },
  { url: '/legal/privacy', priority: 0.5, changefreq: 'yearly' },
  { url: '/legal/terms', priority: 0.5, changefreq: 'yearly' },
  { url: '/legal/billing', priority: 0.5, changefreq: 'yearly' },
];

interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate programmatic SEO URLs for vehicles (cars)
 */
function generateVehicleUrls(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const vehicles = SEO_KEYWORDS.vehicles;

  // Generate brand/model combinations
  Object.values(vehicles.brands).forEach((brand) => {
    const brandSlug = slugify(brand.name);
    
    // Brand level: /cat/vehicles/cars/toyota
    entries.push({
      url: `${SITE_URL}/cat/vehicles/cars/${brandSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    });

    // Model level: /cat/vehicles/cars/toyota/corolla
    brand.models.forEach((model) => {
      const modelSlug = slugify(model);
      entries.push({
        url: `${SITE_URL}/cat/vehicles/cars/${brandSlug}/${modelSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });

      // Location level: /cat/vehicles/cars/toyota/corolla/kampala
      POPULAR_LOCATIONS.kampala.slice(0, 5).forEach((location) => {
        entries.push({
          url: `${SITE_URL}/cat/vehicles/cars/${brandSlug}/${modelSlug}/${slugify(location)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      });
    });
  });

  return entries;
}

/**
 * Generate programmatic SEO URLs for electronics (phones)
 */
function generateElectronicsUrls(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const electronics = SEO_KEYWORDS.electronics;

  // Generate brand/model combinations for phones
  Object.values(electronics.brands).forEach((brand) => {
    const brandSlug = slugify(brand.name);
    
    // Brand level: /cat/phones-and-tablets/mobile-phones/apple
    entries.push({
      url: `${SITE_URL}/cat/phones-and-tablets/mobile-phones/${brandSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    });

    // Model level: /cat/phones-and-tablets/mobile-phones/apple/iphone-13
    brand.models.forEach((model) => {
      const modelSlug = slugify(model);
      entries.push({
        url: `${SITE_URL}/cat/phones-and-tablets/mobile-phones/${brandSlug}/${modelSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });

      // Location level: /cat/phones-and-tablets/mobile-phones/apple/iphone-13/kampala
      POPULAR_LOCATIONS.kampala.slice(0, 3).forEach((location) => {
        entries.push({
          url: `${SITE_URL}/cat/phones-and-tablets/mobile-phones/${brandSlug}/${modelSlug}/${slugify(location)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      });
    });
  });

  return entries;
}

/**
 * Generate programmatic SEO URLs for real estate
 */
function generateRealEstateUrls(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const realEstate = SEO_KEYWORDS.realEstate;

  // Property types
  const propertyTypes = ['houses', 'apartments'];
  const bedrooms = [1, 2, 3, 4, 5];

  propertyTypes.forEach((propertyType) => {
    // Location-based pages: /cat/property/houses-for-rent/kampala/ntinda
    Object.values(realEstate.locations).flat().forEach((location) => {
      entries.push({
        url: `${SITE_URL}/cat/property/${propertyType}-for-rent/${slugify('Kampala')}/${slugify(location)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });

      // Bedroom-specific: /cat/property/houses-for-rent/kampala/ntinda/2-bedroom
      bedrooms.forEach((bedroom) => {
        entries.push({
          url: `${SITE_URL}/cat/property/${propertyType}-for-rent/${slugify('Kampala')}/${slugify(location)}/${bedroom}-bedroom`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      });
    });
  });

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  // Add static pages
  staticPages.forEach((page) => {
    entries.push({
      url: `${SITE_URL}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq as any,
      priority: page.priority,
    });
  });

  try {
    // Fetch categories
    const categories = await getProductCategories();

    // Add category and subcategory pages
    if (Array.isArray(categories)) {
      categories.forEach((category: any) => {
        const categorySlug = slugify(category.category_name);
        
        // Category level: /cat/vehicles
        entries.push({
          url: `${SITE_URL}/cat/${categorySlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });

        // Subcategory pages: /cat/vehicles/cars
        if (category.subcategories && Array.isArray(category.subcategories)) {
          category.subcategories.forEach((subcategory: any) => {
            const subcategorySlug = slugify(subcategory.subcategory_name);
            entries.push({
              url: `${SITE_URL}/cat/${categorySlug}/${subcategorySlug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.75,
            });
          });
        }
      });
    }

    // Add programmatic SEO URLs
    entries.push(...generateVehicleUrls());
    entries.push(...generateElectronicsUrls());
    entries.push(...generateRealEstateUrls());

    // Fetch products (limit to prevent sitemap from being too large)
    // For large sites, consider using sitemap index
    try {
      const productsResponse = await openApiClient.post('/getitems/', {
        page: 1,
        page_size: 5000, // Increased limit for better coverage
      });

      if (productsResponse.data?.results?.data) {
        const products = productsResponse.data.results.data;
        products.forEach((product: any) => {
          if (product.id) {
            entries.push({
              url: `${SITE_URL}/prod/${product.id}`,
              lastModified: product.updated_at || product.created_at || new Date(),
              changeFrequency: 'weekly',
              priority: 0.6,
            });
          }
        });
      }

      // If there are more pages, add a note in console (consider sitemap index for >50k URLs)
      const totalCount = productsResponse.data?.count || 0;
      if (totalCount > 5000) {
        console.warn(
          `Total products (${totalCount}) exceed sitemap limit. Consider implementing sitemap index.`,
        );
      }
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
      // Continue without products if API fails
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if API fails
  }

  // Sort by priority (highest first) for better crawling
  entries.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return entries;
}

