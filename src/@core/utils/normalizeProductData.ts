export interface NormalizedProduct {
  id: number;
  item_name: string;
  item_price: string | number;
  images: {
    id: number;
    image_url: string;
  }[];
  item_location: string;
  item_negotiable: boolean;
  item_status: string;
  item_description: string;
  category: string;
  subcategory: string;
  created_at: string;
  updated_at: string;
}

export function normalizeProduct(product: any): NormalizedProduct {
  return {
    id: product.id,
    item_name: product.item_name ?? '',
    item_price: product.item_price ?? '',
    images: (product.images || []).map((img: any) => ({
      id: img.id ?? img.image_id ?? 0,
      image_url: img.image ?? img.image_url ?? '',
    })),
    item_location: product.item_location ?? '',
    item_negotiable: product.item_negotiable ?? false,
    item_status: product.item_status ?? '',
    item_description: product.item_description ?? '',
    category: product.category ?? '',
    subcategory: product.subcategory ?? '',
    created_at: product.created_at ?? '',
    updated_at: product.updated_at ?? '',
  };
}

export function normalizeProducts(products: any[]): NormalizedProduct[] {
  if (!products || !Array.isArray(products)) return [];
  return products.map(normalizeProduct);
}
