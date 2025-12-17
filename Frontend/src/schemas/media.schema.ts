/**
 * Media Library Schemas - Validação Zod
 *
 * @description
 * Schemas de validação para o módulo MediaLibrary, incluindo arquivos,
 * pastas, metadados e operações de upload.
 *
 * @module schemas/media
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema para metadados de arquivo de mídia
 */
export const MediaMetadataSchema = z.object({
  created_at: z.string(),
  updated_at: z.string().optional(),
  uploaded_by: z.string(),
  camera: z.string().optional(),
  location: z.string().optional(),
  device: z.string().optional(),
  software: z.string().optional(),
  ai_tags: z.array(z.string()).optional(),
  faces_detected: z.number().optional(),
  objects_detected: z.array(z.string()).optional(),
});

/**
 * Schema para arquivo de mídia
 */
export const MediaFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['image', 'video', 'audio', 'document', 'other']),
  format: z.string(),
  size: z.number().min(0),
  dimensions: z
    .object({
      width: z.number().min(0),
      height: z.number().min(0),
    })
    .optional(),
  duration: z.number().min(0).optional(),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  folder_id: z.string().optional(),
  tags: z.array(z.string()),
  metadata: MediaMetadataSchema,
  is_favorite: z.boolean().optional(),
  views_count: z.number().int().min(0).optional(),
  downloads_count: z.number().int().min(0).optional(),
});

/**
 * Schema para pasta de mídia
 */
export const MediaFolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent_id: z.string().optional(),
  files_count: z.number().int().min(0),
  size_total: z.number().min(0),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

/**
 * Schema para estatísticas da biblioteca
 */
export const MediaLibraryStatsSchema = z.object({
  total_files: z.number().int().min(0),
  total_size: z.number().min(0),
  by_type: z.object({
    images: z.number().int().min(0),
    videos: z.number().int().min(0),
    audio: z.number().int().min(0),
    documents: z.number().int().min(0),
    others: z.number().int().min(0),
  }),
  storage_used_percentage: z.number().min(0).max(100),
  recent_uploads: z.number().int().min(0),
  favorites_count: z.number().int().min(0),
});

/**
 * Schema para dados completos da biblioteca
 */
export const MediaLibraryDataSchema = z.object({
  files: z.array(MediaFileSchema),
  folders: z.array(MediaFolderSchema),
  stats: MediaLibraryStatsSchema,
});

/**
 * Schema para upload de arquivo
 */
export const UploadFileSchema = z.object({
  file: z.instanceof(File, { message: 'Deve ser um arquivo válido' }), // File object
  folder_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  auto_tag: z.boolean().optional(),
});

/**
 * Schema para resposta de upload
 */
export const UploadResponseSchema = z.object({
  file: MediaFileSchema,
  message: z.string().optional(),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type MediaMetadata = z.infer<typeof MediaMetadataSchema>;
export type MediaFile = z.infer<typeof MediaFileSchema>;
export type MediaFolder = z.infer<typeof MediaFolderSchema>;
export type MediaLibraryStats = z.infer<typeof MediaLibraryStatsSchema>;
export type MediaLibraryData = z.infer<typeof MediaLibraryDataSchema>;
export type UploadFile = z.infer<typeof UploadFileSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
