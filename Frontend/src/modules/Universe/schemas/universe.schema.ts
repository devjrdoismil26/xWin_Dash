import { z } from 'zod';

export const universeEntitySchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  properties: z.record(z.any()),
  relationships: z.array(z.object({
    target_id: z.string().uuid(),
    type: z.string(),
  })).optional(),
  metadata: z.record(z.any()).optional(),
});

export const universeQuerySchema = z.object({
  entity_type: z.string().optional(),
  filters: z.record(z.any()).optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  offset: z.number().int().min(0).default(0),
});

export type UniverseEntity = z.infer<typeof universeEntitySchema>;
export type UniverseQuery = z.infer<typeof universeQuerySchema>;
