/**
 * Products Schemas - Validação Zod
 *
 * @description
 * Schemas de validação para o módulo Products, incluindo produtos,
 * categorias, inventário e variantes.
 *
 * @module schemas/products
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema para categoria de produto
 */
export const ProductCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  products_count: z.number().int().min(0),
  created_at: z.string(),
});

/**
 * Schema para variante de produto
 */
export const ProductVariantSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number().min(0),
  compare_price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0),
  attributes: z.record(z.string()),
});

/**
 * Schema para produto completo
 */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0),
  compare_price: z.number().min(0).optional(),
  cost_price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0),
  track_inventory: z.boolean().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  category_id: z.string().optional(),
  category: ProductCategorySchema.optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(ProductVariantSchema).optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  views_count: z.number().int().min(0).optional(),
  sales_count: z.number().int().min(0).optional(),
});

/**
 * Schema para estatísticas de produtos
 */
export const ProductStatsSchema = z.object({
  total_products: z.number().int().min(0),
  active_products: z.number().int().min(0),
  draft_products: z.number().int().min(0),
  archived_products: z.number().int().min(0),
  total_value: z.number().min(0),
  low_stock_count: z.number().int().min(0),
  out_of_stock_count: z.number().int().min(0),
  total_categories: z.number().int().min(0),
});

/**
 * Schema para dashboard de produtos
 */
export const ProductCatalogDashboardDataSchema = z.object({
  products: z.array(ProductSchema),
  categories: z.array(ProductCategorySchema),
  stats: ProductStatsSchema,
});

/**
 * Schema para criar/atualizar produto
 */
export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  compare_price: z.number().min(0).optional(),
  cost_price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0, 'Quantidade deve ser positiva'),
  track_inventory: z.boolean().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  category_id: z.string().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductStats = z.infer<typeof ProductStatsSchema>;
export type ProductCatalogDashboardData = z.infer<typeof ProductCatalogDashboardDataSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
