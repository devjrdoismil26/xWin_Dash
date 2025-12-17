import { z } from 'zod';

export const adCampaignSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  platform: z.enum(['google', 'facebook', 'instagram', 'linkedin']),
  budget: z.number().min(0, 'Budget deve ser positivo'),
  daily_budget: z.number().min(0).optional(),
  status: z.enum(['active', 'paused', 'completed', 'draft']).default('draft'),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  targeting: z.record(z.any()).optional(),
});

export const adGroupSchema = z.object({
  id: z.string().uuid().optional(),
  campaign_id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório'),
  bid_amount: z.number().min(0),
  keywords: z.array(z.string()).optional(),
  status: z.enum(['active', 'paused']).default('active'),
});

export const adMetricsSchema = z.object({
  impressions: z.number().int().min(0),
  clicks: z.number().int().min(0),
  conversions: z.number().int().min(0),
  cost: z.number().min(0),
  ctr: z.number().min(0).max(1),
  cpc: z.number().min(0),
  roas: z.number().min(0),
});

export type AdCampaign = z.infer<typeof adCampaignSchema>;
export type AdGroup = z.infer<typeof adGroupSchema>;
export type AdMetrics = z.infer<typeof adMetricsSchema>;
