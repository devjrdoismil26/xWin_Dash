import { z } from 'zod';

export const analyticsMetricSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
  trend: z.enum(['up', 'down', 'stable']),
  change: z.number(),
  format: z.enum(['currency', 'percentage', 'number']).optional(),
});

export const analyticsFilterSchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  metric: z.string().optional(),
  group_by: z.enum(['day', 'week', 'month', 'year']).default('day'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const dashboardConfigSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  widgets: z.array(z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({ x: z.number(), y: z.number() }),
    size: z.object({ width: z.number(), height: z.number() }),
    config: z.record(z.any()).optional(),
  })),
  is_default: z.boolean().default(false),
});

export type AnalyticsMetric = z.infer<typeof analyticsMetricSchema>;
export type AnalyticsFilter = z.infer<typeof analyticsFilterSchema>;
export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;
