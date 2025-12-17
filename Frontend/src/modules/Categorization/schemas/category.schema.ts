import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

export const categoryTreeSchema = z.object({
  category: categorySchema,
  children: z.lazy(() => z.array(categoryTreeSchema)).optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryTree = z.infer<typeof categoryTreeSchema>;
