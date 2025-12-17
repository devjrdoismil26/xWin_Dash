import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  sku: z.string().min(1, 'SKU é obrigatório'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  category_id: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
  images: z.array(z.string().url()).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const productFormSchema = productSchema.omit({ id: true, created_at: true, updated_at: true });

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type Product = z.infer<typeof productSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
