export interface NormalizedProduct {
  id: number;
  name: string;
  price: string | number;
  images: {
    id: number;
    image_url: string;
  }[];
  location?: string;
  negotiable?: boolean;
  status?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  created_at: string;
  updated_at: string;
  dateAdded: string;
}

export function normalizeProduct(product: any): NormalizedProduct {
  return {
    id: product.id,
    name: product.item_name ?? product.name ?? '',
    price: product.item_price ?? product.price ?? 0,
    images: (product.images || []).map((img: any) => ({
      id: img.id ?? img.image_id ?? 0,
      image_url: img.image ?? img.image_url ?? '',
    })),
    location: product.item_location ?? product.location ?? '',
    negotiable: product.item_negotiable ?? product.negotiable ?? false,
    status: product.item_status ?? product.status ?? '',
    description: product.item_description ?? product.description ?? '',
    category: product.category ?? '',
    subcategory: product.subcategory ?? '',
    dateAdded: product.created_at ?? '',
    created_at: product.created_at ?? '',
    updated_at: product.updated_at ?? '',
  };
}

export function normalizeProducts(products: any[]): NormalizedProduct[] {
  if (!products || !Array.isArray(products)) return [];
  return products.map(normalizeProduct);
}
