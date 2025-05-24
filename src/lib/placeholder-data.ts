import type { Restaurant, SkuItem, PricingRule, AdminUser, MonthlyOrderSummary, OverviewStats } from './types';

export const placeholderRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pasta Paradise',
    email: 'contact@pastaparadise.com',
    phone: '555-1234',
    address: '123 Main St, Flavor Town',
    status: 'Pending Approval',
    kycSubmittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    shopInfo: { description: 'Authentic Italian pasta dishes.', cuisineType: 'Italian' },
    kycInfo: 'Business Registration: BR12345, Tax ID: TXN98765, Owner ID: DL13579',
    transactionHistory: 'Recent transactions: $50, $120, $85. Average transaction value: $85. High frequency of small transactions followed by a large one.',
  },
  {
    id: '2',
    name: 'Burger Bliss',
    email: 'info@burgerbliss.com',
    phone: '555-5678',
    address: '456 Oak Ave, Grillville',
    status: 'Approved',
    kycSubmittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    shopInfo: { description: 'Gourmet burgers and fries.', cuisineType: 'American' },
    orderCount: 1200,
    totalRevenue: 24000,
    kycInfo: 'Business Registration: BR67890, Tax ID: TXN12345, Owner ID: DL24680',
    transactionHistory: 'Consistent daily transactions. Average value: $20.',
  },
  {
    id: '3',
    name: 'Sushi Central',
    email: 'manager@sushicentral.com',
    phone: '555-8765',
    address: '789 Pine Ln, Wasabi City',
    status: 'Active',
    kycSubmittedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    shopInfo: { description: 'Fresh sushi and Japanese cuisine.', cuisineType: 'Japanese' },
    orderCount: 2500,
    totalRevenue: 75000,
    kycInfo: 'Business Registration: BR13579, Tax ID: TXN24680, Owner ID: DL97531',
    transactionHistory: 'High volume of transactions, mostly during peak hours. Average value: $30.',
  },
  {
    id: '4',
    name: 'Curry Corner',
    email: 'support@currycorner.com',
    phone: '555-4321',
    address: '101 Spice Rd, Masalaport',
    status: 'Deactivated',
    kycSubmittedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    shopInfo: { description: 'Authentic Indian curries.', cuisineType: 'Indian' },
    orderCount: 500,
    totalRevenue: 10000,
    kycInfo: 'Business Registration: BR24680, Tax ID: TXN13579, Owner ID: DL86420',
    transactionHistory: 'Few transactions over the last month. Account dormant for 2 weeks.',
  },
];

export const placeholderSkus: SkuItem[] = [
  {
    id: 'sku1',
    name: 'Margherita Pizza',
    description: 'Classic delight with 100% real mozzarella cheese',
    price: 12.99,
    category: 'Pizza',
    imageUrl: 'https://placehold.co/300x200.png',
    isOutOfStock: false,
    visibility: ['New York', 'San Francisco'],
  },
  {
    id: 'sku2',
    name: 'Pepperoni Pizza',
    description: 'A classic favorite with spicy pepperoni',
    price: 14.99,
    category: 'Pizza',
    imageUrl: 'https://placehold.co/300x200.png',
    isOutOfStock: true,
    visibility: ['New York', 'Chicago'],
  },
  {
    id: 'sku3',
    name: 'Coca-Cola Can',
    description: '330ml can of refreshing Coca-Cola',
    price: 1.50,
    category: 'Beverages',
    isOutOfStock: false,
    visibility: ['New York', 'San Francisco', 'Chicago', 'Los Angeles'],
  },
];

export const placeholderPricingRules: PricingRule[] = [
  {
    id: 'price1',
    name: 'Standard Pizza Pricing',
    skuId: 'sku1', // Applies to Margherita Pizza
    basePrice: 12.99,
    slabs: [
      { from: 1, to: 10, pricePerUnit: 12.99 },
      { from: 11, to: 20, pricePerUnit: 11.99 },
    ],
    status: 'Approved',
    createdBy: 'Admin User',
    approvedBy: 'Senior Admin',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'price2',
    name: 'Bulk Beverage Offer',
    category: 'Beverages', // Example of category-wide rule
    slabs: [
      { from: 1, to: 50, pricePerUnit: 1.50 },
      { from: 51, to: 200, pricePerUnit: 1.25 },
      { from: 201, to: 500, pricePerUnit: 1.00 },
    ],
    status: 'Pending',
    createdBy: 'Pricing Manager',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const placeholderAdminUsers: AdminUser[] = [
  {
    id: 'user1',
    name: 'Alice Wonderland',
    email: 'alice@menumaster.com',
    role: 'Admin',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user2',
    name: 'Bob The Builder',
    email: 'bob@menumaster.com',
    role: 'Maker',
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    email: 'charlie@menumaster.com',
    role: 'Checker',
    isActive: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const placeholderMonthlySummaries: MonthlyOrderSummary[] = [
  { month: 'Jan 2024', totalOrders: 1200, totalRevenue: 24000 },
  { month: 'Feb 2024', totalOrders: 1500, totalRevenue: 30000 },
  { month: 'Mar 2024', totalOrders: 1350, totalRevenue: 27000 },
  { month: 'Apr 2024', totalOrders: 1600, totalRevenue: 32000 },
];

export const placeholderOverviewStats: OverviewStats = {
  totalRestaurants: 150,
  pendingApprovals: 5,
  totalSkus: 850,
  totalRevenue: 550000,
};

// Extend SkuItem for PricingRule if category is used instead of skuId
export interface PricingRule {
  id: string;
  name: string;
  skuId?: string;
  category?: string; // For category-wide rules
  basePrice?: number;
  slabs: { from: number; to: number; pricePerUnit: number }[];
  status: 'Pending' | 'Approved' | 'Rejected';
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
}
