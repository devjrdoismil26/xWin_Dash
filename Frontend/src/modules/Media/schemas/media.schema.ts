import { z } from 'zod';

export const mediaFileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['image', 'video', 'audio', 'document']),
  mime_type: z.string(),
  size: z.number().int().min(0),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  folder_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string().datetime().optional(),
});

export const mediaFolderSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  parent_id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
});

export const mediaUploadSchema = z.object({
  file: z.instanceof(File),
  folder_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

export const mediaFilterSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'document']).optional(),
  folder_id: z.string().uuid().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type MediaFile = z.infer<typeof mediaFileSchema>;
export type MediaFolder = z.infer<typeof mediaFolderSchema>;
export type MediaUpload = z.infer<typeof mediaUploadSchema>;
export type MediaFilter = z.infer<typeof mediaFilterSchema>;
