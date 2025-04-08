export interface UserProfile {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_picture: string;
  address: string;
  contact: string;
  national_id_or_passport_number: string;
  national_id_or_passport_document: string;
}

export interface Item {
  id: number;
  price: number;
  location: string;
  color?: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  images: { image_url: string }[];
  status: string;
  item_negotiable: boolean;
}

export interface ShopData {
  user_profile: UserProfile;
  items: {
    total_items: number;
    available_items: number;
    sold_items: number;
    item_details: Item[];
  };
}

export type FilterOption =
  | 'default'
  | 'rating'
  | 'price_low_to_high'
  | 'price_high_to_low';
