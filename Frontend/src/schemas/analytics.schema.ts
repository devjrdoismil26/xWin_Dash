/**
 * Schemas Zod para Analytics
 * 
 * @description
 * Define schemas de validação para dados do módulo Analytics avançado.
 * Suporta dashboards, relatórios, insights, segmentos, funis e mais.
 * 
 * @module schemas/analytics
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema de Métrica Individual
 * 
 * @description
 * Representa uma métrica específica com valor e metadados
 */
export const MetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  change: z.number().optional(),
  change_percentage: z.number().optional(),
  trend: z.enum(['up', 'down', 'stable']).optional(),
  period: z.string().optional(),
});

/**
 * Schema de Dashboard Analytics
 * 
 * @description
 * Dashboard principal com KPIs e métricas consolidadas
 */
export const AnalyticsDashboardSchema = z.object({
  kpis: z.array(MetricSchema),
  pageviews: z.number().int().nonnegative(),
  sessions: z.number().int().nonnegative(),
  users: z.number().int().nonnegative(),
  bounce_rate: z.number().nonnegative(),
  avg_session_duration: z.number().nonnegative(),
  conversion_rate: z.number().nonnegative(),
  revenue: z.number().nonnegative().optional(),
  top_pages: z.array(z.object({
    path: z.string(),
    views: z.number().int().nonnegative(),
    unique_views: z.number().int().nonnegative(),
  })).optional(),
  traffic_sources: z.record(z.string(), z.number().int().nonnegative()).optional(),
});

/**
 * Schema de Relatório Analytics
 * 
 * @description
 * Relatório customizado com dados filtrados
 */
export const AnalyticsReportSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  data: z.array(z.object({
    date: z.string(),
    metrics: z.record(z.string(), z.number()),
  })),
  period: z.object({
    start: z.string(),
    end: z.string(),
  }),
  filters: z.record(z.any()).optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

/**
 * Schema de Insight Automático
 * 
 * @description
 * Insights gerados automaticamente pelo sistema
 */
export const InsightSchema = z.object({
  id: z.string(),
  type: z.enum(['trend', 'anomaly', 'opportunity', 'warning']),
  title: z.string(),
  description: z.string(),
  metric: z.string(),
  impact: z.enum(['high', 'medium', 'low']),
  confidence: z.number().min(0).max(1),
  action_items: z.array(z.string()).optional(),
  created_at: z.string(),
});

/**
 * Schema de Segmento de Usuários
 * 
 * @description
 * Segmentação de usuários por comportamento/atributos
 */
export const SegmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  criteria: z.record(z.any()),
  user_count: z.number().int().nonnegative(),
  created_at: z.string(),
});

/**
 * Schema de Funil de Conversão
 * 
 * @description
 * Etapas de um funil com taxas de conversão
 */
export const FunnelSchema = z.object({
  id: z.string(),
  name: z.string(),
  steps: z.array(z.object({
    name: z.string(),
    users: z.number().int().nonnegative(),
    conversion_rate: z.number().nonnegative(),
    drop_off: z.number().nonnegative(),
  })),
  total_users: z.number().int().nonnegative(),
  overall_conversion_rate: z.number().nonnegative(),
  created_at: z.string(),
});

/**
 * Schema de Análise de Coorte
 * 
 * @description
 * Análise de comportamento de coortes ao longo do tempo
 */
export const CohortSchema = z.object({
  id: z.string(),
  name: z.string(),
  period: z.enum(['daily', 'weekly', 'monthly']),
  metric: z.string(),
  data: z.array(z.array(z.number())),
  cohort_labels: z.array(z.string()),
  period_labels: z.array(z.string()),
  created_at: z.string(),
});

/**
 * Schema de Meta/Goal
 * 
 * @description
 * Meta de performance com tracking
 */
export const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  metric: z.string(),
  target_value: z.number(),
  current_value: z.number(),
  progress_percentage: z.number().min(0).max(100),
  status: z.enum(['on_track', 'at_risk', 'behind', 'completed']),
  deadline: z.string(),
  created_at: z.string(),
});

/**
 * Schema de Alerta
 * 
 * @description
 * Alerta configurável baseado em métricas
 */
export const AlertSchema = z.object({
  id: z.string(),
  name: z.string(),
  metric: z.string(),
  condition: z.enum(['above', 'below', 'equals']),
  threshold: z.number(),
  is_active: z.boolean(),
  last_triggered: z.string().optional(),
  created_at: z.string(),
});

/**
 * Schema de Dados em Tempo Real
 * 
 * @description
 * Métricas atualizadas em tempo real
 */
export const RealTimeDataSchema = z.object({
  active_users: z.number().int().nonnegative(),
  pageviews_per_minute: z.number().int().nonnegative(),
  top_active_pages: z.array(z.object({
    path: z.string(),
    active_users: z.number().int().nonnegative(),
  })),
  recent_events: z.array(z.object({
    event: z.string(),
    timestamp: z.string(),
    properties: z.record(z.any()).optional(),
  })),
  timestamp: z.string(),
});

/**
 * Schema Completo de Dados do Analytics Manager
 * 
 * @description
 * Agrupa todos os dados do gerenciador avançado de analytics
 * 
 * @example
 * ```typescript
 * import { AnalyticsManagerDataSchema } from '@/schemas/analytics.schema';
 * import { useValidatedGet } from '@/hooks/useValidatedApi';
 * 
 * const { data, loading, error } = useValidatedGet(
 *   '/api/analytics/manager',
 *   AnalyticsManagerDataSchema,
 *   true
 *);

 * ```
 */
export const AnalyticsManagerDataSchema = z.object({
  dashboard: AnalyticsDashboardSchema,
  reports: z.array(AnalyticsReportSchema),
  insights: z.array(InsightSchema),
  segments: z.array(SegmentSchema).optional(),
  funnels: z.array(FunnelSchema).optional(),
  cohorts: z.array(CohortSchema).optional(),
  goals: z.array(GoalSchema).optional(),
  alerts: z.array(AlertSchema).optional(),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type Metric = z.infer<typeof MetricSchema>;
export type AnalyticsDashboard = z.infer<typeof AnalyticsDashboardSchema>;
export type AnalyticsReport = z.infer<typeof AnalyticsReportSchema>;
export type Insight = z.infer<typeof InsightSchema>;
export type Segment = z.infer<typeof SegmentSchema>;
export type Funnel = z.infer<typeof FunnelSchema>;
export type Cohort = z.infer<typeof CohortSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type RealTimeData = z.infer<typeof RealTimeDataSchema>;
export type AnalyticsManagerData = z.infer<typeof AnalyticsManagerDataSchema>;
