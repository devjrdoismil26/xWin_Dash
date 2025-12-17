import { z } from 'zod';

export const activitySchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  action: z.string().min(1),
  entity_type: z.string(),
  entity_id: z.string().uuid().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  ip_address: z.string().ip().optional(),
  user_agent: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export const activityFilterSchema = z.object({
  user_id: z.string().uuid().optional(),
  action: z.string().optional(),
  entity_type: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type Activity = z.infer<typeof activitySchema>;
export type ActivityFilter = z.infer<typeof activityFilterSchema>;
