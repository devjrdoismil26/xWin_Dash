import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  total: z.number().int().min(0).optional(),
  total_pages: z.number().int().min(0).optional(),
});

export const sortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export const dateRangeSchema = z.object({
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
}).refine((data: unknown) => new Date(data.start_date) <= new Date(data.end_date), {
  message: 'Data inicial deve ser anterior à data final',
  path: ['end_date'],
});

export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  max_size: z.number().int().default(10 * 1024 * 1024), // 10MB
  allowed_types: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/gif']),
});

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type Sort = z.infer<typeof sortSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
