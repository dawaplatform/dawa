import type { NormalizedProduct } from '@/@core/utils/normalizeProductData';

/**
 * Minimum shape needed to pick a category icon. Works for both the Redux
 * `Category` slice and the view-layer `Category` type.
 */
interface CategoryLike {
  id: string | number;
  category_name: string;
  image_url?: string | null;
  cover_image_url?: string | null;
  cover_image_urls?: string[] | null;
}

/**
 * Build a lookup of `categoryId -> first available item image` from a list of
 * normalized products. Items are matched to categories by category name (the
 * API returns `product.category` as a string), preserving the first image seen
 * per category.
 *
 * Mirrors the mobile app's `buildCategoryImageMap` so both clients render the
 * same "use an item photo as the category icon" behaviour when a category has
 * no explicit `image_url`.
 */
export function buildCategoryImageMap(
  categories: CategoryLike[],
  products: NormalizedProduct[],
): Record<string, string | null> {
  const map: Record<string, string | null> = {};
  const categoryNames = new Map(
    categories.map((c) => [c.category_name.toLowerCase(), String(c.id)]),
  );

  for (const product of products) {
    const catName = (product.category || '').toLowerCase();
    const categoryId = categoryNames.get(catName);
    if (!categoryId || map[categoryId]) continue;
    const firstImage = product.images?.[0]?.image_url;
    if (firstImage) {
      map[categoryId] = firstImage;
    }
  }
  return map;
}

/**
 * Resolve the best single image for a category: explicit `image_url`, then the
 * backend's `cover_image_url` (newest listing photo), then a loaded product's
 * image. Returns `null` when nothing is available — callers render an icon.
 */
export function getCategoryImageUrl(
  category: CategoryLike,
  categoryImageFromItems: Record<string, string | null>,
): string | null {
  return (
    category.image_url ||
    category.cover_image_url ||
    categoryImageFromItems[String(category.id)] ||
    null
  );
}

/**
 * Images a category icon should cycle through. An admin-set `image_url` is a
 * deliberate choice and stays fixed; otherwise use the backend's list of recent
 * listing photos (spread across subcategories), then fall back to a loaded item.
 */
export function getCategoryImageUrls(
  category: CategoryLike,
  categoryImageFromItems: Record<string, string | null>,
): string[] {
  if (category.image_url) return [category.image_url];
  const covers = (category.cover_image_urls ?? []).filter(Boolean);
  if (covers.length) return Array.from(new Set(covers));
  const single = category.cover_image_url || categoryImageFromItems[String(category.id)];
  return single ? [single] : [];
}

/** Ask Cloudinary for a small square crop so icons don't download full photos. */
export function thumbnailUrl(url: string, size: number): string {
  const marker = '/image/upload/';
  if (!url.includes('res.cloudinary.com') || !url.includes(marker)) return url;
  const px = Math.round(size * 2);
  return url.replace(marker, `${marker}c_fill,w_${px},h_${px},q_auto,f_auto/`);
}
