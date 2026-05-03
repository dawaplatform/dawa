import type { NormalizedProduct } from '@/@core/utils/normalizeProductData';

/**
 * Minimum shape needed to pick a category icon. Works for both the Redux
 * `Category` slice and the view-layer `Category` type.
 */
interface CategoryLike {
  id: string | number;
  category_name: string;
  image_url?: string | null;
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
 * Resolve the best image for a category: explicit `image_url` from the backend
 * first, otherwise fall back to a product's image (via `buildCategoryImageMap`).
 * Returns `null` when no image is available — callers should render a
 * Lucide/FC icon in that case.
 */
export function getCategoryImageUrl(
  category: CategoryLike,
  categoryImageFromItems: Record<string, string | null>,
): string | null {
  if (category.image_url) return category.image_url;
  return categoryImageFromItems[String(category.id)] ?? null;
}
