/**
 * Email Marketing Schemas - Validação Zod
 *
 * @description
 * Schemas de validação para o módulo EmailMarketing, incluindo métricas,
 * campanhas, templates, automações e performance.
 *
 * @module schemas/emailmarketing
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema para métricas gerais de email marketing
 */
export const EmailMetricsSchema = z.object({
  total_campaigns: z.number().int().min(0),
  active_campaigns: z.number().int().min(0),
  total_sent: z.number().int().min(0),
  total_subscribers: z.number().int().min(0),
  open_rate: z.number().min(0).max(100),
  click_rate: z.number().min(0).max(100),
  unsubscribe_rate: z.number().min(0).max(100),
  bounce_rate: z.number().min(0).max(100),
  conversion_rate: z.number().min(0).max(100),
  revenue_generated: z.number().min(0),
  cost_per_acquisition: z.number().min(0),
  roi: z.number(),
  deliverability_score: z.number().min(0).max(100),
  spam_score: z.number().min(0).max(100),
  list_growth_rate: z.number(),
  engagement_score: z.number().min(0).max(100),
});

/**
 * Schema para campanhas de email
 */
export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'paused']),
  type: z.enum(['newsletter', 'promotional', 'welcome', 'abandoned_cart', 'follow_up']),
  sent_count: z.number().int().min(0),
  open_rate: z.number().min(0).max(100),
  click_rate: z.number().min(0).max(100),
  conversion_rate: z.number().min(0).max(100),
  revenue: z.number().min(0),
  created_at: z.string(),
  scheduled_at: z.string().optional(),
  sent_at: z.string().optional(),
  segment: z.string(),
  template_id: z.string().optional(),
  ab_test: z.boolean().optional(),
  automation: z.boolean().optional(),
});

/**
 * Schema para templates de email
 */
export const EmailTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['html', 'plain', 'mjml']),
  category: z.string(),
  thumbnail: z.string(),
  usage_count: z.number().int().min(0),
  performance_score: z.number().min(0).max(100),
  last_used: z.string(),
  created_at: z.string(),
  ai_optimized: z.boolean().optional(),
});

/**
 * Schema para fluxos de automação
 */
export const AutomationFlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'paused', 'draft']),
  trigger: z.string(),
  steps: z.number().int().min(0),
  subscribers: z.number().int().min(0),
  completion_rate: z.number().min(0).max(100),
  revenue_generated: z.number().min(0),
  created_at: z.string(),
});

/**
 * Schema para dados de performance temporal
 */
export const PerformanceDataSchema = z.object({
  date: z.string(),
  sent: z.number().int().min(0),
  opened: z.number().int().min(0),
  clicked: z.number().int().min(0),
  converted: z.number().int().min(0),
  bounced: z.number().int().min(0),
  unsubscribed: z.number().int().min(0),
  revenue: z.number().min(0),
});

/**
 * Schema para o dashboard completo de email marketing
 */
export const EmailMarketingDashboardDataSchema = z.object({
  metrics: EmailMetricsSchema,
  campaigns: z.array(CampaignSchema),
  templates: z.array(EmailTemplateSchema),
  automations: z.array(AutomationFlowSchema),
  performance_data: z.array(PerformanceDataSchema),
});

/**
 * Schema para criar/atualizar campanha
 */
export const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  type: z.enum(['newsletter', 'promotional', 'welcome', 'abandoned_cart', 'follow_up']),
  segment: z.string(),
  template_id: z.string().optional(),
  scheduled_at: z.string().optional(),
  ab_test: z.boolean().optional(),
});

/**
 * Schema para subscriber
 */
export const SubscriberSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  status: z.enum(['active', 'inactive', 'unsubscribed', 'bounced']),
  source: z.string(),
  tags: z.array(z.string()),
  engagement_score: z.number().min(0).max(100),
  lifetime_value: z.number().min(0),
  last_activity: z.string(),
  subscription_date: z.string(),
  location: z.string().optional(),
  preferences: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    categories: z.array(z.string()),
  }),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type EmailMetrics = z.infer<typeof EmailMetricsSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type AutomationFlow = z.infer<typeof AutomationFlowSchema>;
export type PerformanceData = z.infer<typeof PerformanceDataSchema>;
export type EmailMarketingDashboardData = z.infer<typeof EmailMarketingDashboardDataSchema>;
export type CreateCampaign = z.infer<typeof CreateCampaignSchema>;
export type Subscriber = z.infer<typeof SubscriberSchema>;
