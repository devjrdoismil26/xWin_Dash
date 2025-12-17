export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  status: ProductStatus;
  category: ProductCategory;
  tags: string[];
  images: ProductImage[];
  variations: ProductVariation[];
  dimensions: ProductDimensions;
  weight: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
  projectId: string;
  createdAt: Date;
  updatedAt: Date; }

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string;
  attributes: Record<string, string>;
  inventory: number;
  images: string[];
  status: ProductStatus; }

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  isPrimary: boolean;
  order: number; }

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in'; }

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean; }

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredData: Record<string, any>; }

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export enum ProductCategory {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
  SERVICE = 'service',
  SUBSCRIPTION = 'subscription'
}
