/**
 * Schemas Zod para Dashboard
 * 
 * @description
 * Define schemas de validação para dados do dashboard usando Zod.
 * Garante type safety e validação em runtime para todas as respostas da API.
 * 
 * @module schemas/dashboard
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema de Métricas do Dashboard
 * 
 * @description
 * Define a estrutura das métricas principais do dashboard
 */
export const DashboardMetricsSchema = z.object({
  total_leads: z.number().int().nonnegative(),
  total_users: z.number().int().nonnegative(),
  total_projects: z.number().int().nonnegative(),
  active_projects: z.number().int().nonnegative(),
  total_campaigns: z.number().int().nonnegative(),
  total_revenue: z.number().nonnegative(),
  conversion_rate: z.number().nonnegative(),
  leads_growth: z.number(),
  users_growth: z.number(),
  projects_growth: z.number(),
  campaigns_growth: z.number(),
  revenue_growth: z.number(),
});

/**
 * Schema de Atividade Recente
 * 
 * @description
 * Define a estrutura de uma atividade recente do sistema
 */
export const RecentActivitySchema = z.object({
  id: z.string(),
  action: z.string(),
  description: z.string(),
  count: z.number().int().nonnegative(),
  timestamp: z.string().datetime(),
  type: z.enum(['lead', 'project', 'user', 'campaign', 'system']),
  user_id: z.string().optional(),
  user_name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Schema de Top Lead
 * 
 * @description
 * Define a estrutura de um lead de alto valor
 */
export const TopLeadSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  score: z.number().nonnegative(),
  status: z.string(),
  source: z.string(),
  created_at: z.string().datetime(),
  last_activity_at: z.string().datetime().optional(),
});

/**
 * Schema de Owner de Projeto
 * 
 * @description
 * Define a estrutura básica do proprietário de um projeto
 */
export const ProjectOwnerSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
});

/**
 * Schema de Projeto Recente
 * 
 * @description
 * Define a estrutura de um projeto recente
 */
export const RecentProjectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  owner_id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
  progress: z.number().min(0).max(100).optional(),
  owner: ProjectOwnerSchema.optional(),
});

/**
 * Schema de Estatísticas do Dashboard
 * 
 * @description
 * Define estatísticas detalhadas como distribuições e tendências
 */
export const DashboardStatsSchema = z.object({
  leads_by_status: z.record(z.string(), z.number().int().nonnegative()),
  leads_by_source: z.record(z.string(), z.number().int().nonnegative()),
  monthly_leads: z.record(z.string(), z.number().int().nonnegative()),
});

/**
 * Schema Completo de Dados do Dashboard
 * 
 * @description
 * Schema principal que agrupa todos os dados do dashboard
 * 
 * @example
 * ```typescript
 * import { DashboardDataSchema } from '@/schemas/dashboard.schema';
 * import { useValidatedGet } from '@/hooks/useValidatedApi';
 * 
 * const { data, loading, error } = useValidatedGet(
 *   '/api/dashboard/data',
 *   DashboardDataSchema,
 *   true
 *);

 * ```
 */
export const DashboardDataSchema = z.object({
  metrics: DashboardMetricsSchema,
  recent_activities: z.array(RecentActivitySchema),
  top_leads: z.array(TopLeadSchema),
  recent_projects: z.array(RecentProjectSchema),
  stats: DashboardStatsSchema,
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>;
export type RecentActivity = z.infer<typeof RecentActivitySchema>;
export type TopLead = z.infer<typeof TopLeadSchema>;
export type RecentProject = z.infer<typeof RecentProjectSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
