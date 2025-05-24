
export type RestaurantStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Active' | 'Deactivated' | 'Fraudulent';

export interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: RestaurantStatus;
  kycSubmittedAt?: string; 
  shopInfo?: {
    description: string;
    cuisineType: string;
  };
  orderCount?: number;
  totalRevenue?: number;
  transactionHistory?: string; 
  kycInfo?: string; 
}

export interface SkuItem {
  id:string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isOutOfStock: boolean;
  visibility: string[]; // Array of city names
}

export interface PricingRule {
  id: string;
  name: string; // Name for this pricing rule
  skuId?: string; 
  basePrice?: number; // Optional if only slab pricing
  slabs: { from: number; to: number; pricePerUnit: number }[];
  status: 'Pending' | 'Approved' | 'Rejected'; 
  createdBy: string; 
  approvedBy?: string;
  createdAt: string; // ISO date string
}

export type UserRole = 'Admin' | 'Maker' | 'Checker';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string; 
  createdAt: string; // ISO date string
}

export interface MonthlyOrderSummary {
  month: string; 
  totalOrders: number;
  totalRevenue: number;
}

export interface OverviewStats {
  totalRestaurants: number;
  pendingApprovals: number;
  totalSkus: number;
  totalRevenue: number;
}
