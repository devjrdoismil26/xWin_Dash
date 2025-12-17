/**
 * Schemas Zod para ADStool
 * 
 * @description
 * Define schemas de validação para dados do módulo ADStool (campanhas publicitárias).
 * Garante type safety e validação em runtime para todas as respostas da API.
 * 
 * @module schemas/adstool
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema de Métricas de Campanha
 * 
 * @description
 * Define a estrutura completa de uma campanha publicitária
 */
export const CampaignMetricsSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'paused', 'completed', 'draft']),
  platform: z.string(),
  budget: z.number().nonnegative(),
  spent: z.number().nonnegative(),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  conversions: z.number().int().nonnegative(),
  ctr: z.number().nonnegative(), // Click-through rate
  cpc: z.number().nonnegative(), // Cost per click
  cpa: z.number().nonnegative(), // Cost per acquisition
  roas: z.number().nonnegative(), // Return on ad spend
  reach: z.number().int().nonnegative(),
  frequency: z.number().nonnegative(),
  start_date: z.string(),
  end_date: z.string(),
  objective: z.string(),
});

/**
 * Schema de Overview de ADStool
 * 
 * @description
 * Métricas gerais consolidadas de todas as campanhas
 */
export const ADSOverviewMetricsSchema = z.object({
  total_campaigns: z.number().int().nonnegative(),
  active_campaigns: z.number().int().nonnegative(),
  total_budget: z.number().nonnegative(),
  total_spent: z.number().nonnegative(),
  total_impressions: z.number().int().nonnegative(),
  total_clicks: z.number().int().nonnegative(),
  total_conversions: z.number().int().nonnegative(),
  average_ctr: z.number().nonnegative(),
  average_cpc: z.number().nonnegative(),
  average_roas: z.number().nonnegative(),
  budget_utilization: z.number().nonnegative(),
  performance_trend: z.enum(['up', 'down', 'stable']),
  top_performing_platform: z.string(),
});

/**
 * Schema de Dados Completos do Dashboard ADStool
 * 
 * @description
 * Agrupa overview e lista de campanhas
 * 
 * @example
 * ```typescript
 * import { ADSToolDashboardDataSchema } from '@/schemas/adstool.schema';
 * import { useValidatedGet } from '@/hooks/useValidatedApi';
 * 
 * const { data, loading, error } = useValidatedGet(
 *   '/api/adstool/dashboard',
 *   ADSToolDashboardDataSchema,
 *   true
 *);

 * ```
 */
export const ADSToolDashboardDataSchema = z.object({
  overview: ADSOverviewMetricsSchema,
  campaigns: z.array(CampaignMetricsSchema),
});

/**
 * Schema para Criação de Campanha
 * 
 * @description
 * Dados necessários para criar uma nova campanha
 */
export const CreateCampaignSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  platform: z.string(),
  budget: z.number().positive('Budget deve ser maior que zero'),
  start_date: z.string(),
  end_date: z.string(),
  objective: z.string(),
  status: z.enum(['active', 'paused', 'draft']).optional(),
});

/**
 * Schema para Atualização de Campanha
 * 
 * @description
 * Campos que podem ser atualizados em uma campanha existente
 */
export const UpdateCampaignSchema = z.object({
  name: z.string().min(3).optional(),
  status: z.enum(['active', 'paused', 'completed', 'draft']).optional(),
  budget: z.number().positive().optional(),
  end_date: z.string().optional(),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CampaignMetrics = z.infer<typeof CampaignMetricsSchema>;
export type ADSOverviewMetrics = z.infer<typeof ADSOverviewMetricsSchema>;
export type ADSToolDashboardData = z.infer<typeof ADSToolDashboardDataSchema>;
export type CreateCampaignData = z.infer<typeof CreateCampaignSchema>;
export type UpdateCampaignData = z.infer<typeof UpdateCampaignSchema>;
