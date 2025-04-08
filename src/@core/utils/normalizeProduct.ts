import type { Product } from '@/views/pages/wishlist/types/wishList';

export const normalizeProduct = (item: any): Product => ({
  id: item.id,
  // Use either key – prefer the one that exists:
  name: item.name || item.item_name || '',
  price: item.price || item.item_price || '0',
  originalPrice: item.originalPrice || item.original_price || '0',
  discount: 0,
  // For the image, check if it’s stored directly or in an images array.
  image:
    item.image ||
    (item.images && item.images.length > 0
      ? item.images[0].image_url || item.images[0].image
      : ''),
  rating: item.rating || 0,
  orders: item.orders || 0,
  // Only use created_at since location is not a date.
  dateAdded: item.created_at || item.dateAdded || '',
  description: item.description || item.item_description || '',
});
