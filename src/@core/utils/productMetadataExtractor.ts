/**
 * Extract brand, model, and other metadata from product data
 * Used for programmatic SEO URL generation
 */

export interface ExtractedMetadata {
  brand?: string;
  model?: string;
  year?: string;
  condition?: string;
  location?: string;
}

/**
 * Extract brand and model from product name or metadata
 */
export function extractBrandModel(
  productName: string,
  metadata?: Record<string, string>,
): { brand?: string; model?: string } {
  const result: { brand?: string; model?: string } = {};

  // Check metadata first
  if (metadata) {
    if (metadata.brand) result.brand = metadata.brand;
    if (metadata.model) result.model = metadata.model;
    if (result.brand && result.model) return result;
  }

  // Try to extract from product name
  const name = productName.toLowerCase();

  // Common car brands
  const carBrands = [
    'toyota',
    'subaru',
    'mercedes',
    'mercedes-benz',
    'bmw',
    'honda',
    'nissan',
    'mazda',
    'ford',
    'volkswagen',
    'vw',
    'audi',
    'lexus',
  ];

  // Common phone brands
  const phoneBrands = [
    'iphone',
    'samsung',
    'tecno',
    'infinix',
    'itel',
    'huawei',
    'xiaomi',
    'oppo',
    'vivo',
  ];

  const allBrands = [...carBrands, ...phoneBrands];

  // Find brand in product name
  for (const brand of allBrands) {
    if (name.includes(brand)) {
      result.brand = capitalizeFirst(brand);
      break;
    }
  }

  // Extract model (usually comes after brand)
  if (result.brand) {
    const brandIndex = name.indexOf(result.brand.toLowerCase());
    if (brandIndex !== -1) {
      const afterBrand = productName
        .substring(brandIndex + result.brand.length)
        .trim();
      // Model is usually the next 1-3 words
      const words = afterBrand.split(/\s+/).slice(0, 3);
      if (words.length > 0 && words[0].length > 0) {
        result.model = words.join(' ').split(/[,\-]/)[0].trim();
      }
    }
  }

  return result;
}

/**
 * Extract location from product location field
 */
export function extractLocation(location: string): string | undefined {
  if (!location) return undefined;

  // Common Kampala areas
  const kampalaAreas = [
    'kololo',
    'munyonyo',
    'muyenga',
    'bugolobi',
    'naguru',
    'ntinda',
    'naalya',
    'kira',
    'namugongo',
    'kiwatule',
    'kyaliwajjala',
    'kisaasi',
    'lubowa',
    'seguku',
    'kawempe',
    'makindye',
    'rubaga',
    'nakawa',
  ];

  const lowerLocation = location.toLowerCase();

  // Check for Kampala areas
  for (const area of kampalaAreas) {
    if (lowerLocation.includes(area)) {
      return capitalizeFirst(area);
    }
  }

  // Check for major cities
  const cities = ['kampala', 'entebbe', 'jinja', 'mbarara', 'gulu', 'mbale', 'masaka'];
  for (const city of cities) {
    if (lowerLocation.includes(city)) {
      return capitalizeFirst(city);
    }
  }

  return undefined;
}

/**
 * Extract year from product name or metadata
 */
export function extractYear(
  productName: string,
  metadata?: Record<string, string>,
): string | undefined {
  if (metadata?.year) return metadata.year;

  // Look for 4-digit year (2000-2030)
  const yearMatch = productName.match(/\b(20[0-2][0-9])\b/);
  if (yearMatch) {
    return yearMatch[1];
  }

  return undefined;
}

/**
 * Extract condition from product name or metadata
 */
export function extractCondition(
  productName: string,
  metadata?: Record<string, string>,
): string | undefined {
  if (metadata?.condition) return metadata.condition;

  const name = productName.toLowerCase();
  if (name.includes('new') || name.includes('brand new')) return 'New';
  if (name.includes('used') || name.includes('second hand')) return 'Used';
  if (name.includes('refurbished')) return 'Refurbished';

  return undefined;
}

/**
 * Extract all metadata from product
 */
export function extractAllMetadata(
  product: {
    item_name: string;
    item_location?: string;
    metadata?: Record<string, string>;
  },
): ExtractedMetadata {
  const { brand, model } = extractBrandModel(product.item_name, product.metadata);

  return {
    brand,
    model,
    year: extractYear(product.item_name, product.metadata),
    condition: extractCondition(product.item_name, product.metadata),
    location: product.item_location
      ? extractLocation(product.item_location)
      : undefined,
  };
}

/**
 * Capitalize first letter of each word
 */
function capitalizeFirst(text: string): string {
  return text
    .split(/[\s-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


