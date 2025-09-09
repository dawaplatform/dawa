export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  image: string;
  rating?: number;
  orders?: number;
  dateAdded: string;
  description?: string;
}

export interface ProductCardProps {
  product: Product;
}
