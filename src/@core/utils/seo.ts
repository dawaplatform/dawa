import mainConfig from '@/@core/configs/mainConfigs';
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dawa.ug';
const SITE_NAME = 'Dawa.Ug';
const DEFAULT_DESCRIPTION =
  'Buy and sell in Uganda. Dawa.Ug is your trusted marketplace for finding great deals on products and services across Uganda.';

/**
 * Build canonical URL
 */
export function buildCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate default metadata
 */
export function generateDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} - Buy and Sell in Uganda | Marketplace`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      'Uganda marketplace',
      'buy sell Uganda',
      'classifieds Uganda',
      'online marketplace',
      'Uganda e-commerce',
      'Dawa Uganda',
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: mainConfig.usedLocale,
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} - Buy and Sell in Uganda`,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: `${SITE_URL}/assets/icons/Logo_1.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - Buy and Sell in Uganda`,
      description: DEFAULT_DESCRIPTION,
      images: [`${SITE_URL}/assets/icons/Logo_1.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_CODE,
    },
  };
}

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const canonical = path ? buildCanonicalUrl(path) : SITE_URL;
  const ogImage = image || `${SITE_URL}/assets/icons/Logo_1.png`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/icons/Logo_1.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UG',
    },
    sameAs: [
      // Add social media links when available
    ],
  };
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: {
  id: string | number;
  item_name: string;
  item_description?: string;
  item_price?: string;
  images?: Array<{ image_url?: string; image?: string }>;
  item_status?: string;
  category?: string;
  subcategory?: string;
  seller?: {
    seller_name?: string;
    seller_email?: string;
  };
  created_at?: string;
  updated_at?: string;
}) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].image_url || product.images[0].image || ''
      : `${SITE_URL}/assets/images/default_image.webp`;

  const price = product.item_price
    ? parseFloat(product.item_price.replace(/[^0-9.]/g, ''))
    : null;

  const availability =
    product.item_status?.toLowerCase() === 'available'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.item_name,
    description: product.item_description || product.item_name,
    image: imageUrl,
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: mainConfig.usedCurrency,
        availability: availability,
        url: `${SITE_URL}/prod/${product.id}`,
      },
    }),
    category: product.category || product.subcategory,
    brand: {
      '@type': 'Brand',
      name: product.seller?.seller_name || SITE_NAME,
    },
    ...(product.seller && {
      seller: {
        '@type': 'Person',
        name: product.seller.seller_name,
        email: product.seller.seller_email,
      },
    }),
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.url),
    })),
  };
}

/**
 * Generate CollectionPage structured data for category pages
 */
export function generateCollectionPageSchema({
  name,
  description,
  url,
  numberOfItems,
}: {
  name: string;
  description?: string;
  url: string;
  numberOfItems?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description: description || `Browse ${name} products on ${SITE_NAME}`,
    url: buildCanonicalUrl(url),
    ...(numberOfItems && { numberOfItems }),
    mainEntity: {
      '@type': 'ItemList',
      name,
    },
  };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness schema (for location-specific pages)
 */
export function generateLocalBusinessSchema({
  name,
  description,
  address,
  telephone,
  priceRange,
}: {
  name: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description: description || name,
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address,
      },
    }),
    ...(telephone && { telephone }),
    ...(priceRange && { priceRange }),
    areaServed: {
      '@type': 'Country',
      name: 'Uganda',
    },
  };
}

/**
 * Format price for structured data
 */
export function formatPrice(price: string | number): number | null {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const cleaned = price.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Truncate text for meta descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Generate programmatic SEO metadata for category pages
 * Template: [Model Name] for Sale in Uganda - Best Prices | Dawa.Ug
 */
export function generateCategoryMetadata({
  category,
  subcategory,
  brand,
  model,
  location,
  itemCount,
  priceRange,
}: {
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  location?: string;
  itemCount?: number;
  priceRange?: { min?: number; max?: number };
}): Metadata {
  // Build title based on hierarchy
  let title = '';
  let description = '';

  if (model && brand) {
    // Model level: "Toyota Corolla for Sale in Uganda - Best Prices | Dawa.Ug"
    title = `${brand} ${model} for Sale in Uganda - Best Prices | ${SITE_NAME}`;
    description = `Find the best deals on ${brand} ${model} in Uganda. Browse ${itemCount || 'hundreds of'} listings of used and new ${brand} ${model} cars for sale${location ? ` in ${location}` : ' in Kampala and across Uganda'}.`;
  } else if (brand) {
    // Brand level: "Toyota Cars for Sale in Uganda | Dawa.Ug"
    title = `${brand} ${category} for Sale in Uganda | ${SITE_NAME}`;
    description = `Browse ${itemCount || 'hundreds of'} ${brand} ${category} listings in Uganda. Find the best prices on ${brand} vehicles${location ? ` in ${location}` : ''}.`;
  } else if (subcategory) {
    // Subcategory level: "Cars for Sale in Uganda | Dawa.Ug"
    title = `${subcategory} for Sale in Uganda | ${SITE_NAME}`;
    description = `Find ${subcategory.toLowerCase()} for sale in Uganda. Browse ${itemCount || 'thousands of'} listings${location ? ` in ${location}` : ' across Uganda'}.`;
  } else {
    // Category level
    title = `${category} for Sale in Uganda | ${SITE_NAME}`;
    description = `Browse ${itemCount || 'thousands of'} ${category.toLowerCase()} listings in Uganda.`;
  }

  // Add location to title if specified
  if (location) {
    title = title.replace(' in Uganda', ` in ${location}, Uganda`);
  }

  // Add price range if available
  if (priceRange?.min && priceRange?.max) {
    description += ` Prices range from ${formatPriceDisplay(priceRange.min)} to ${formatPriceDisplay(priceRange.max)}.`;
  }

  const path = buildCategoryPath(category, subcategory, brand, model, location);

  return generatePageMetadata({
    title,
    description: truncateDescription(description, 160),
    path,
  });
}

/**
 * Generate programmatic SEO metadata for real estate pages
 * Template: [Number] Bedroom Houses for Rent in [Location] | Dawa.Ug
 */
export function generateRealEstateMetadata({
  propertyType,
  bedrooms,
  location,
  itemCount,
  priceRange,
}: {
  propertyType: string; // e.g., "Houses", "Apartments"
  bedrooms?: number;
  location?: string;
  itemCount?: number;
  priceRange?: { min?: number; max?: number };
}): Metadata {
  let title = '';
  let description = '';

  if (bedrooms) {
    title = `${bedrooms} Bedroom ${propertyType} for Rent${location ? ` in ${location}` : ' in Kampala'} | ${SITE_NAME}`;
    description = `Looking for a ${bedrooms} bedroom ${propertyType.toLowerCase()}${location ? ` in ${location}` : ' in Kampala'}? We have ${itemCount || 'hundreds of'} available rental properties, furnished and unfurnished`;
  } else {
    title = `${propertyType} for Rent${location ? ` in ${location}` : ' in Kampala'} | ${SITE_NAME}`;
    description = `Find ${propertyType.toLowerCase()} for rent${location ? ` in ${location}` : ' in Kampala'}. Browse ${itemCount || 'hundreds of'} listings`;
  }

  if (priceRange?.min) {
    description += ` starting from ${formatPriceDisplay(priceRange.min)}.`;
  } else {
    description += '.';
  }

  const path = buildCategoryPath('property', propertyType.toLowerCase(), undefined, undefined, location);

  return generatePageMetadata({
    title,
    description: truncateDescription(description, 160),
    path,
  });
}

/**
 * Build category path for URLs
 */
function buildCategoryPath(
  category: string,
  subcategory?: string,
  brand?: string,
  model?: string,
  location?: string,
): string {
  const parts: string[] = ['cat'];
  
  if (category) parts.push(slugifyText(category));
  if (subcategory) parts.push(slugifyText(subcategory));
  if (brand) parts.push(slugifyText(brand));
  if (model) parts.push(slugifyText(model));
  if (location) parts.push(slugifyText(location));

  return '/' + parts.join('/');
}

/**
 * Slugify text for URLs
 */
function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[']/g, '')
    .replace(/[,]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format price for display
 */
function formatPriceDisplay(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M UGX`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K UGX`;
  }
  return `${price} UGX`;
}

/**
 * Generate keywords array for meta tags
 */
export function generateKeywords({
  category,
  subcategory,
  brand,
  model,
  location,
}: {
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  location?: string;
}): string[] {
  const keywords: string[] = [];

  // Base keywords
  keywords.push(`${category} for sale in Uganda`);
  if (subcategory) {
    keywords.push(`${subcategory} for sale in Uganda`);
    keywords.push(`${subcategory} for sale in Kampala`);
  }

  // Brand keywords
  if (brand) {
    keywords.push(`${brand} for sale in Uganda`);
    keywords.push(`${brand} ${category} Uganda`);
  }

  // Model keywords
  if (model && brand) {
    keywords.push(`${brand} ${model} price in Uganda`);
    keywords.push(`${brand} ${model} for sale`);
    keywords.push(`Used ${brand} ${model} Uganda`);
  }

  // Location keywords
  if (location) {
    keywords.push(`${category} for sale in ${location}`);
    if (subcategory) {
      keywords.push(`${subcategory} in ${location}`);
    }
    if (brand) {
      keywords.push(`${brand} in ${location}`);
    }
  }

  // Generic marketplace keywords
  keywords.push('buy and sell Uganda', 'Uganda marketplace', 'classifieds Uganda');

  return keywords;
}

