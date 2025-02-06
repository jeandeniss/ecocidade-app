export interface User {
  id: string;
  email: string;
  username: string;
  isPremium: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  certifications: string[];
  affiliateLink: string;
  platform: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface FavoriteProduct {
  userId: string;
  product: Product;
  addedAt: Date;
}