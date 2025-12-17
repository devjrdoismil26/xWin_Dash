import { z } from 'zod';

export const emailCampaignSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  from_email: z.string().email('Email inválido'),
  from_name: z.string().min(1),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  status: z.enum(['draft', 'scheduled', 'sent', 'paused']).default('draft'),
  scheduled_at: z.string().datetime().optional(),
  list_ids: z.array(z.string().uuid()),
});

export const emailListSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  subscribers_count: z.number().int().min(0).default(0),
});

export const emailSubscriberSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
  status: z.enum(['active', 'unsubscribed', 'bounced']).default('active'),
  list_ids: z.array(z.string().uuid()),
  tags: z.array(z.string()).optional(),
});

export type EmailCampaign = z.infer<typeof emailCampaignSchema>;
export type EmailList = z.infer<typeof emailListSchema>;
export type EmailSubscriber = z.infer<typeof emailSubscriberSchema>;
