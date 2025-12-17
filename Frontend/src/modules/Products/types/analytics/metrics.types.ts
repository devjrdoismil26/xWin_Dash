export interface ProductMetrics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalRevenue: number;
  averagePrice: number;
  totalViews: number;
  totalSales: number;
  conversionRate: number;
  averageRating: number;
  totalReviews: number; }

export interface SalesMetrics {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  conversionRate: number;
  revenueGrowth: number;
  salesGrowth: number;
  topProducts: TopProduct[];
  salesByCategory: CategorySales[];
  salesByPeriod: PeriodSales[]; }

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  errorRate: number;
  uptime: number;
  throughput: number;
  activeUsers: number;
  bounceRate: number;
  sessionDuration: number;
  data?: string;
  success?: boolean;
  message?: string;
  error?: string; }

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  churnRate: number;
  retentionRate: number;
  averageOrdersPerCustomer: number;
  customerSatisfaction: number; }

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  views: number; }

export interface CategorySales {
  category: string;
  sales: number;
  revenue: number;
  percentage: number; }

export interface PeriodSales {
  period: string;
  sales: number;
  revenue: number;
  orders: number; }
