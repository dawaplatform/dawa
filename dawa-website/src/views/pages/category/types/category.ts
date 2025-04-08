export interface Subcategory {
  id: string;
  name: string;
  count: number;
  icon: React.ElementType;
  href: string;
  subcategory_name: string;
}

export interface Category {
  id: string;
  category_name: string;
  category_item_count: number;
  name?: string;
  count?: number;
  icon?: string;
  href?: string;
  subcategories?: Subcategory[];
}

export interface ProductCarouselItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  discountPercentage?: number;
  ctaText: string;
  ctaUrl: string;
}
