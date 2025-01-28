export interface EcoStore {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  address: string;
  coordinates: [number, number]; // [latitude, longitude]
  rating: number;
  reviewCount: number;
  certifications: string[];
  products: string[];
  openingHours: {
    [key: string]: string;
  };
}

export type StoreCategory = 
  | 'zero-waste'
  | 'organic'
  | 'local-produce'
  | 'sustainable-fashion'
  | 'eco-products'
  | 'repair-shop';

export const storeCategories: Record<StoreCategory, string> = {
  'zero-waste': 'Zero Waste Stores',
  'organic': 'Organic Markets',
  'local-produce': 'Local Producers',
  'sustainable-fashion': 'Sustainable Fashion',
  'eco-products': 'Eco-friendly Products',
  'repair-shop': 'Repair Shops'
};

// Sample data - in a real app, this would come from a database
export const ecoStores: EcoStore[] = [
  {
    id: '1',
    name: 'Green Earth Market',
    description: 'Zero waste grocery store with local organic products',
    category: 'zero-waste',
    address: '123 Eco Street, Green City',
    coordinates: [51.505, -0.09],
    rating: 4.8,
    reviewCount: 156,
    certifications: ['Organic Certified', 'Zero Waste Verified'],
    products: ['Bulk foods', 'Local produce', 'Eco-friendly household items'],
    openingHours: {
      'Mon-Fri': '9:00 AM - 8:00 PM',
      'Sat-Sun': '10:00 AM - 6:00 PM'
    }
  },
  {
    id: '2',
    name: 'Sustainable Threads',
    description: 'Ethical and sustainable fashion boutique',
    category: 'sustainable-fashion',
    address: '456 Green Avenue, Eco Town',
    coordinates: [51.51, -0.1],
    rating: 4.6,
    reviewCount: 89,
    certifications: ['Fair Trade', 'Sustainable Textile'],
    products: ['Organic clothing', 'Recycled accessories', 'Eco-friendly shoes'],
    openingHours: {
      'Mon-Sat': '10:00 AM - 7:00 PM',
      'Sun': 'Closed'
    }
  }
];