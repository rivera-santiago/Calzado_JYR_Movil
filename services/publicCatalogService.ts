export interface Product {
  id: string;
  name: string;
  description?: string;
  color?: string;
  brand_id?: string;
  style_id?: string;
  category_id?: string;
  image_url?: string;
  price?: number;
  state?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}
