/**
 * SEO Keywords Database for Programmatic SEO
 * Based on Jiji.ug research - high-value keywords organized by category
 */

export const SEO_KEYWORDS = {
  vehicles: {
    primary: [
      'Cars for sale in Uganda',
      'Used cars for sale in Kampala',
      'Cheap cars for sale in Uganda',
      'Cars for sale in Kampala',
      'Foreign used cars in Uganda',
      'Locally used cars in Uganda',
    ],
    brands: {
      toyota: {
        name: 'Toyota',
        models: [
          'Corolla',
          'Harrier',
          'Land Cruiser',
          'Prado',
          'V8',
          'Hilux',
          'RAV4',
          'Wish',
          'Noah',
          'Vitz',
          'Mark X',
          'Premio',
          'Fielder',
        ],
      },
      subaru: {
        name: 'Subaru',
        models: ['Forester', 'Impreza', 'Legacy'],
      },
      mercedes: {
        name: 'Mercedes-Benz',
        models: ['C-Class', 'ML-Class'],
      },
      commercial: {
        name: 'Commercial',
        models: ['Mitsubishi Fuso', 'Canter', 'Isuzu Elf'],
      },
    },
    longTail: [
      'Toyota Corolla price in Uganda',
      'Cars for sale in Uganda under 10 million',
      'Foreign used cars in Bond',
      'Locally used cars',
    ],
  },
  realEstate: {
    primary: [
      'Houses for rent in Kampala',
      'Apartments for rent in Kampala',
      'Land for sale in Uganda',
      'Furnished apartments for rent',
      'Houses for sale in Uganda',
    ],
    locations: {
      highEnd: ['Kololo', 'Munyonyo', 'Muyenga', 'Bugolobi', 'Naguru'],
      midRange: [
        'Ntinda',
        'Naalya',
        'Kira',
        'Namugongo',
        'Kiwatule',
        'Kyaliwajjala',
        'Kisaasi',
      ],
      entebbeRoad: ['Lubowa', 'Seguku', 'Entebbe'],
    },
    searchTerms: [
      '2 bedroom house for rent in',
      '3 bedroom house for rent in',
      'Studio apartments for rent in Kampala',
      'Stand alone house for rent',
    ],
  },
  electronics: {
    primary: [
      'Mobile phones for sale in Uganda',
      'Laptops for sale in Kampala',
      'Used iPhones Uganda',
      'Smartphones for sale in Uganda',
    ],
    brands: {
      apple: {
        name: 'Apple',
        models: ['iPhone 11', 'iPhone X', 'iPhone 12', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max'],
      },
      samsung: {
        name: 'Samsung',
        models: ['Galaxy A14', 'Galaxy A54', 'Galaxy S21', 'Galaxy S22'],
      },
      budget: {
        name: 'Budget Phones',
        models: ['Tecno Camon', 'Tecno Spark', 'Infinix Hot', 'Infinix Note', 'Itel'],
      },
    },
    modifiers: ['Refurbished laptops', 'UK used phones', 'Swap phones'],
  },
  jobs: {
    primary: [
      'Jobs in Uganda',
      'House maids for hire',
      'Plumbers in Kampala',
      'Moving services Uganda',
    ],
  },
};

/**
 * Popular locations in Uganda for SEO
 */
export const POPULAR_LOCATIONS = {
  kampala: [
    'Kololo',
    'Munyonyo',
    'Muyenga',
    'Bugolobi',
    'Naguru',
    'Ntinda',
    'Naalya',
    'Kira',
    'Namugongo',
    'Kiwatule',
    'Kyaliwajjala',
    'Kisaasi',
    'Lubowa',
    'Seguku',
    'Kawempe',
    'Makindye',
    'Rubaga',
    'Nakawa',
    'Central',
  ],
  other: ['Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Mbale', 'Masaka'],
};

/**
 * Generate SEO-friendly URL path
 */
export function generateSEOUrl(
  category: string,
  subcategory?: string,
  brand?: string,
  model?: string,
  location?: string,
): string {
  const parts: string[] = [];

  // Category level: e.g., "cars-for-sale"
  if (category) {
    parts.push(slugify(category));
  }

  // Subcategory level: e.g., "cars-for-sale/toyota"
  if (subcategory) {
    parts.push(slugify(subcategory));
  }

  // Brand level: e.g., "cars-for-sale/toyota/corolla"
  if (brand) {
    parts.push(slugify(brand));
  }

  // Model level: e.g., "cars-for-sale/toyota/corolla"
  if (model) {
    parts.push(slugify(model));
  }

  // Location level: e.g., "houses-for-rent/kampala/ntinda"
  if (location) {
    parts.push(slugify(location));
  }

  return parts.join('/');
}

/**
 * Slugify helper
 */
function slugify(text: string): string {
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


