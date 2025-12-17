import { z } from 'zod';

export const integrationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  provider: z.string().min(1),
  status: z.enum(['connected', 'disconnected', 'error']).default('disconnected'),
  credentials: z.record(z.string()).optional(),
  config: z.record(z.any()).optional(),
  last_sync: z.string().datetime().optional(),
});

export const integrationWebhookSchema = z.object({
  id: z.string().uuid().optional(),
  integration_id: z.string().uuid(),
  event: z.string().min(1),
  url: z.string().url(),
  secret: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type Integration = z.infer<typeof integrationSchema>;
export type IntegrationWebhook = z.infer<typeof integrationWebhookSchema>;
