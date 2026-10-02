export type ProductCategory =
  | 'All'
  | 'Laboratory Chemicals'
  | 'Analytical Instruments'
  | 'Borosilicate Glassware'
  | 'Lab Plasticware & Consumables'
  | 'Safety & Cleanroom';

export type StockStatus = 'In Stock' | 'Limited Stock' | 'Pre-Order';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  sku: string;
  casNumber?: string;
  chemicalFormula?: string;
  purityGrade?: string;
  packSize: string;
  brand: string;
  stockStatus: StockStatus;
  stockUnits: number;
  puneWarehouseLocation: string;
  dispatchTime: string;
  priceEstimate?: string;
  description: string;
  keySpecs: ProductSpec[];
  image: string;
  isFeatured?: boolean;
  storageCondition?: string;
  msdsAvailable: boolean;
  coaAvailable: boolean;
  applications?: string[];
}

export interface RfqItem {
  product: Product;
  quantity: number;
  packSize: string;
  notes?: string;
  needCoa?: boolean;
  needMsds?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  department: string;
  location: string;
  content: string;
  rating: number;
  verifiedPurchase: string;
  date: string;
}

export interface WarehouseLocationInfo {
  name: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  contact: string;
  email: string;
  hours: string;
  emergencyDispatch: string;
}
